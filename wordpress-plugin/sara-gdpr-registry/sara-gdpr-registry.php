<?php
/**
 * Plugin Name:       Sara D'Angelo - Registro Consensi GDPR
 * Description:       Registro elettronico dei consensi cookie e privacy conforme al Garante Privacy (Linee Guida 10/06/2021). Riceve consensi via REST API da wedding.saradangelo.it, raccoglie le richieste degli sposi (leads) ed invia notifiche email. Fornisce interfaccia con export CSV per il Garante e per le richieste sposi.
 * Version:           1.1.0
 * Requires at least: 5.0
 * Requires PHP:      7.0
 * Author:            Creativia Studio
 * Text Domain:       sara-consent-registry
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package Sara_Consent_Registry
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SARA_GDPR_VERSION', '1.1.0' );
define( 'SARA_GDPR_TABLE', 'sara_cookie_consents' );
define( 'SARA_LEADS_TABLE', 'sara_leads' );
define( 'SARA_GDPR_NAMESPACE', 'sara-gdpr/v1' );
define( 'SARA_GDPR_ALLOWED_ORIGIN', 'https://wedding.saradangelo.it' );
define( 'SARA_GDPR_DEFAULT_POLICY_VERSION', 'v1.0' );

/**
 * Recipients of the "new wedding lead" notification email.
 *
 * @return string[]
 */
function sara_leads_notification_recipients() {
	return array(
		'info@saradangelo.it',
		'sviluppo@creativiastudio.com',
	);
}

/**
 * Fully-qualified name of the consents table.
 *
 * @return string
 */
function sara_gdpr_get_table_name() {
	global $wpdb;

	return $wpdb->prefix . SARA_GDPR_TABLE;
}

/**
 * Fully-qualified name of the wedding leads table.
 *
 * @return string
 */
function sara_leads_get_table_name() {
	global $wpdb;

	return $wpdb->prefix . SARA_LEADS_TABLE;
}

/**
 * Create (or upgrade) the consents and leads tables on activation.
 *
 * @return void
 */
function sara_gdpr_activate() {
	global $wpdb;

	$table_name      = sara_gdpr_get_table_name();
	$leads_table     = sara_leads_get_table_name();
	$charset_collate = $wpdb->get_charset_collate();

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	$sql = "CREATE TABLE {$table_name} (
		id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
		anonymous_id VARCHAR(64) NOT NULL,
		consent_type VARCHAR(32) NOT NULL,
		categories TEXT NOT NULL,
		ip_hash VARCHAR(64) NOT NULL,
		user_agent TEXT NULL,
		policy_version VARCHAR(16) NOT NULL DEFAULT 'v1.0',
		created_at DATETIME NOT NULL,
		PRIMARY KEY  (id),
		KEY idx_created (created_at),
		KEY idx_anon (anonymous_id)
	) {$charset_collate};";

	dbDelta( $sql );

	$leads_sql = "CREATE TABLE {$leads_table} (
		id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
		first_name VARCHAR(128) NOT NULL DEFAULT '',
		last_name VARCHAR(128) NOT NULL DEFAULT '',
		email VARCHAR(191) NOT NULL DEFAULT '',
		phone VARCHAR(64) NOT NULL DEFAULT '',
		wedding_date VARCHAR(64) NOT NULL DEFAULT '',
		location VARCHAR(191) NOT NULL DEFAULT '',
		guests VARCHAR(64) NOT NULL DEFAULT '',
		budget TEXT NULL,
		message TEXT NULL,
		notes TEXT NULL,
		source VARCHAR(128) NOT NULL DEFAULT 'Landing Wedding',
		status VARCHAR(32) NOT NULL DEFAULT 'nuovo',
		metadata LONGTEXT NULL,
		created_at DATETIME NOT NULL,
		PRIMARY KEY  (id),
		KEY idx_leads_created (created_at),
		KEY idx_leads_email (email)
	) {$charset_collate};";

	dbDelta( $leads_sql );

	update_option( 'sara_gdpr_db_version', SARA_GDPR_VERSION );
}
register_activation_hook( __FILE__, 'sara_gdpr_activate' );

/**
 * Ensure the table exists on upgrades (e.g. plugin updated via FTP).
 *
 * @return void
 */
function sara_gdpr_maybe_upgrade_table() {
	if ( get_option( 'sara_gdpr_db_version' ) !== SARA_GDPR_VERSION ) {
		sara_gdpr_activate();
	}
}
add_action( 'plugins_loaded', 'sara_gdpr_maybe_upgrade_table' );

/* -------------------------------------------------------------------------
 * REST API
 * ---------------------------------------------------------------------- */

/**
 * Register the logging and CORS preflight routes.
 *
 * @return void
 */
function sara_gdpr_register_rest_routes() {
	register_rest_route(
		SARA_GDPR_NAMESPACE,
		'/log',
		array(
			'methods'             => WP_REST_Server::CREATABLE, // POST.
			'callback'            => 'sara_gdpr_rest_log',
			'permission_callback' => '__return_true',
			'args'                => array(
				'anonymous_id'   => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'consent_type'   => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_key',
				),
				'categories'     => array(
					'required' => true,
				),
				'policy_version' => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'ip_hash'        => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		)
	);

	register_rest_route(
		SARA_GDPR_NAMESPACE,
		'/lead',
		array(
			'methods'             => WP_REST_Server::CREATABLE, // POST.
			'callback'            => 'sara_leads_rest_create',
			'permission_callback' => '__return_true',
			'args'                => array(
				'first_name'   => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'last_name'    => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'name'         => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'email'        => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_email',
				),
				'phone'        => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'wedding_date' => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'date'         => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'location'     => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'guests'       => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'budget'       => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'message'      => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'notes'        => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'source'       => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'status'       => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_key',
				),
				'metadata'     => array(
					'required' => false,
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'sara_gdpr_register_rest_routes' );

/**
 * Register the OPTIONS method for the log route.
 *
 * Registered separately because WP_REST_Server has no dedicated OPTIONS constant.
 *
 * @return void
 */
function sara_gdpr_register_options_route() {
	register_rest_route(
		SARA_GDPR_NAMESPACE,
		'/log',
		array(
			'methods'             => 'OPTIONS',
			'callback'            => 'sara_gdpr_rest_preflight',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'sara_gdpr_register_options_route', 20 );

/**
 * Answer the CORS preflight request.
 *
 * @return WP_REST_Response
 */
function sara_gdpr_rest_preflight() {
	return new WP_REST_Response( null, 204 );
}

/**
 * Emit CORS headers for every response of our REST namespace.
 *
 * @param bool             $served  Whether the request has already been served.
 * @param WP_HTTP_Response $result  Result to send to the client.
 * @param WP_REST_Request  $request Request used to generate the response.
 * @param WP_REST_Server   $server  Server instance.
 * @return bool
 */
function sara_gdpr_cors_headers( $served, $result, $request, $server ) {
	unset( $result, $server );

	$route = $request->get_route();

	if ( false !== strpos( (string) $route, '/' . SARA_GDPR_NAMESPACE . '/' ) ) {
		header( 'Access-Control-Allow-Origin: ' . SARA_GDPR_ALLOWED_ORIGIN );
		header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
		header( 'Access-Control-Max-Age: 86400' );
		header( 'Vary: Origin', false );
	}

	return $served;
}
add_filter( 'rest_pre_serve_request', 'sara_gdpr_cors_headers', 15, 4 );

/**
 * Normalise the "categories" payload into a JSON string.
 *
 * Accepts either a JSON string, an already-decoded associative array or an
 * object sent inside the request body. Returns false when it cannot be parsed.
 *
 * @param mixed $categories Raw categories value.
 * @return string|false JSON-encoded categories, or false on failure.
 */
function sara_gdpr_normalize_categories( $categories ) {
	if ( is_string( $categories ) ) {
		$decoded = json_decode( $categories, true );

		if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
			return false;
		}

		$categories = $decoded;
	}

	if ( ! is_array( $categories ) ) {
		return false;
	}

	$clean = array();

	foreach ( $categories as $key => $value ) {
		$clean[ sanitize_key( $key ) ] = (bool) $value;
	}

	return wp_json_encode( $clean );
}

/**
 * Resolve the client IP address.
 *
 * @return string
 */
function sara_gdpr_get_client_ip() {
	$ip = '';

	if ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
		$ip = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
	}

	/**
	 * Allow overriding the detected client IP (e.g. behind a reverse proxy).
	 *
	 * @param string $ip Detected IP address.
	 */
	return (string) apply_filters( 'sara_gdpr_client_ip', $ip );
}

/**
 * Handle POST /sara-gdpr/v1/log.
 *
 * @param WP_REST_Request $request Incoming request.
 * @return WP_REST_Response|WP_Error
 */
function sara_gdpr_rest_log( WP_REST_Request $request ) {
	global $wpdb;

	$params = $request->get_json_params();

	if ( ! is_array( $params ) || empty( $params ) ) {
		$params = $request->get_params();
	}

	$anonymous_id = isset( $params['anonymous_id'] ) ? sanitize_text_field( (string) $params['anonymous_id'] ) : '';
	$consent_type = isset( $params['consent_type'] ) ? sanitize_key( (string) $params['consent_type'] ) : '';
	$categories   = isset( $params['categories'] ) ? sara_gdpr_normalize_categories( $params['categories'] ) : false;

	if ( '' === $anonymous_id ) {
		return new WP_Error(
			'sara_gdpr_missing_anonymous_id',
			__( 'Il campo anonymous_id è obbligatorio.', 'sara-consent-registry' ),
			array( 'status' => 400 )
		);
	}

	if ( '' === $consent_type ) {
		return new WP_Error(
			'sara_gdpr_missing_consent_type',
			__( 'Il campo consent_type è obbligatorio.', 'sara-consent-registry' ),
			array( 'status' => 400 )
		);
	}

	if ( false === $categories ) {
		return new WP_Error(
			'sara_gdpr_invalid_categories',
			__( 'Il campo categories deve essere un oggetto JSON valido.', 'sara-consent-registry' ),
			array( 'status' => 400 )
		);
	}

	$policy_version = isset( $params['policy_version'] ) ? sanitize_text_field( (string) $params['policy_version'] ) : '';
	if ( '' === $policy_version ) {
		$policy_version = SARA_GDPR_DEFAULT_POLICY_VERSION;
	}

	// IP hash: use the client-provided value when present, otherwise compute it.
	if ( ! empty( $params['ip_hash'] ) ) {
		$ip_hash = substr( sanitize_text_field( (string) $params['ip_hash'] ), 0, 64 );
	} else {
		$ip_hash = hash( 'sha256', sara_gdpr_get_client_ip() );
	}

	$user_agent = '';
	if ( ! empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
		$user_agent = substr( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ), 0, 500 );
	}

	$inserted = $wpdb->insert(
		sara_gdpr_get_table_name(),
		array(
			'anonymous_id'   => $anonymous_id,
			'consent_type'   => $consent_type,
			'categories'     => $categories,
			'ip_hash'        => $ip_hash,
			'user_agent'     => $user_agent,
			'policy_version' => $policy_version,
			'created_at'     => current_time( 'mysql' ),
		),
		array( '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
	);

	if ( false === $inserted ) {
		return new WP_Error(
			'sara_gdpr_db_error',
			__( 'Impossibile registrare il consenso.', 'sara-consent-registry' ),
			array( 'status' => 500 )
		);
	}

	return new WP_REST_Response(
		array(
			'success' => true,
			'id'      => (int) $wpdb->insert_id,
		),
		201
	);
}

/* -------------------------------------------------------------------------
 * Wedding leads (Richieste Sposi)
 * ---------------------------------------------------------------------- */

/**
 * Normalise an Italian phone number into an international `39xxxxxxxxxx` form.
 *
 * Used both for the wa.me deep link and for Meta advanced matching.
 *
 * @param string $raw Raw phone number.
 * @return string Digits with country code, or an empty string.
 */
function sara_leads_normalize_phone( $raw ) {
	$digits = preg_replace( '/\D+/', '', (string) $raw );

	if ( '' === (string) $digits ) {
		return '';
	}

	if ( 0 === strpos( $digits, '0039' ) ) {
		$digits = substr( $digits, 2 );
	} elseif ( preg_match( '/^3\d{8,9}$/', $digits ) ) {
		$digits = '39' . $digits;
	}

	return $digits;
}

/**
 * Force the notification email sender address.
 *
 * @return string
 */
function sara_leads_mail_from() {
	return 'info@saradangelo.it';
}

/**
 * Force the notification email sender name.
 *
 * @return string
 */
function sara_leads_mail_from_name() {
	return "Sara D'Angelo Wedding Architect";
}

/**
 * Build the luxury HTML notification email for a new wedding lead.
 *
 * @param array $lead Lead data.
 * @return string
 */
function sara_leads_build_notification_html( $lead ) {
	$couple_name = trim( $lead['first_name'] . ' ' . $lead['last_name'] );
	if ( '' === $couple_name ) {
		$couple_name = 'Sposi';
	}

	$phone_digits = sara_leads_normalize_phone( isset( $lead['phone'] ) ? $lead['phone'] : '' );

	$rows = array(
		'Nome'        => esc_html( $lead['first_name'] ),
		'Cognome'     => esc_html( $lead['last_name'] ),
		'Email'       => '<a href="mailto:' . esc_attr( $lead['email'] ) . '" style="color:#B89768;text-decoration:none;">' . esc_html( $lead['email'] ) . '</a>',
		'Telefono'    => '',
		'Data Nozze'  => esc_html( $lead['wedding_date'] ),
		'Invitati'    => esc_html( $lead['guests'] ),
		'Location'    => esc_html( $lead['location'] ),
		'Budget'      => esc_html( $lead['budget'] ),
		'Provenienza' => esc_html( $lead['source'] ),
	);

	if ( '' !== $phone_digits ) {
		$rows['Telefono'] = '<a href="https://wa.me/' . esc_attr( $phone_digits ) . '" style="color:#B89768;text-decoration:none;">'
			. esc_html( $lead['phone'] )
			. ' &nbsp;·&nbsp; WhatsApp</a>';
	} else {
		$rows['Telefono'] = esc_html( $lead['phone'] );
	}

	$detail_rows = '';
	foreach ( $rows as $label => $value ) {
		if ( '' === (string) $value ) {
			$value = '<span style="color:#a0a0a0;">—</span>';
		}
		$detail_rows .= '<tr>'
			. '<td style="padding:12px 16px;border-bottom:1px solid #efe7da;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a7a63;width:190px;vertical-align:top;">' . esc_html( $label ) . '</td>'
			. '<td style="padding:12px 16px;border-bottom:1px solid #efe7da;font-size:15px;color:#2A2118;vertical-align:top;">' . $value . '</td>'
			. '</tr>';
	}

	$message_html = '';
	if ( '' !== trim( (string) $lead['message'] ) ) {
		$message_html = '<tr><td colspan="2" style="padding:12px 16px;border-bottom:1px solid #efe7da;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a7a63;">Messaggio degli Sposi</td></tr>'
			. '<tr><td colspan="2" style="padding:0 16px 20px 16px;border-bottom:1px solid #efe7da;font-size:15px;line-height:1.7;color:#2A2118;white-space:pre-line;">' . esc_html( $lead['message'] ) . '</td></tr>';
	}

	$html  = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>';
	$html .= '<body style="margin:0;padding:24px;background:#f5f1ea;font-family:Georgia, \'Times New Roman\', serif;">';
	$html .= '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e3d9c8;border-radius:6px;overflow:hidden;">';
	$html .= '<tr><td style="background:#2A2118;padding:32px 24px;text-align:center;">';
	$html .= '<div style="font-size:12px;letter-spacing:.35em;text-transform:uppercase;color:#B89768;">Sara D\'Angelo</div>';
	$html .= '<div style="font-size:26px;color:#FDFBF7;margin-top:8px;letter-spacing:.04em;">Wedding Architect</div>';
	$html .= '<div style="font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:#B89768;margin-top:10px;">Nuova Richiesta Sposi</div>';
	$html .= '</td></tr>';
	$html .= '<tr><td style="padding:28px 24px 8px 24px;">';
	$html .= '<p style="margin:0 0 4px 0;font-size:20px;color:#2A2118;">💍 ' . esc_html( $couple_name ) . '</p>';
	$html .= '<p style="margin:0 0 20px 0;font-size:14px;color:#8a7a63;">Hai ricevuto una nuova richiesta dalla landing page <strong>wedding.saradangelo.it</strong>.</p>';
	$html .= '</td></tr>';
	$html .= '<tr><td style="padding:0 8px 8px 8px;">';
	$html .= '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">';
	$html .= $detail_rows;
	$html .= $message_html;
	$html .= '</table>';
	$html .= '</td></tr>';
	$html .= '<tr><td style="padding:20px 24px 32px 24px;">';
	$html .= '<a href="mailto:' . esc_attr( $lead['email'] ) . '" style="display:inline-block;background:#B89768;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;">Rispondi agli Sposi</a>';
	$html .= '<p style="margin:20px 0 0 0;font-size:12px;color:#a0a0a0;">Notifica automatica generata da wedding.saradangelo.it — Creativia Studio</p>';
	$html .= '</td></tr>';
	$html .= '</table>';
	$html .= '</body></html>';

	return $html;
}

/**
 * Send the "new wedding lead" notification email.
 *
 * @param array $lead Lead data.
 * @return bool
 */
function sara_leads_send_notification_email( $lead ) {
	$recipients  = sara_leads_notification_recipients();
	$couple_name = trim( $lead['first_name'] . ' ' . $lead['last_name'] );
	if ( '' === $couple_name ) {
		$couple_name = 'Sposi';
	}

	$subject = sprintf( '💍 Nuovo Contatto Sposi: %s — wedding.saradangelo.it', $couple_name );
	$body    = sara_leads_build_notification_html( $lead );

	$headers = array(
		'Content-Type: text/html; charset=UTF-8',
		'Reply-To: ' . $lead['email'],
	);

	add_filter( 'wp_mail_from', 'sara_leads_mail_from', 99 );
	add_filter( 'wp_mail_from_name', 'sara_leads_mail_from_name', 99 );

	$sent = wp_mail( $recipients, $subject, $body, $headers );

	remove_filter( 'wp_mail_from', 'sara_leads_mail_from', 99 );
	remove_filter( 'wp_mail_from_name', 'sara_leads_mail_from_name', 99 );

	return (bool) $sent;
}

/**
 * Handle POST /sara-gdpr/v1/lead.
 *
 * Persists the wedding lead in wp_sara_leads and notifies the studio.
 *
 * @param WP_REST_Request $request Incoming request.
 * @return WP_REST_Response|WP_Error
 */
function sara_leads_rest_create( WP_REST_Request $request ) {
	global $wpdb;

	$params = $request->get_json_params();

	if ( ! is_array( $params ) || empty( $params ) ) {
		$params = $request->get_params();
	}

	$email = isset( $params['email'] ) ? sanitize_email( (string) $params['email'] ) : '';

	if ( '' === $email || ! is_email( $email ) ) {
		return new WP_Error(
			'sara_leads_invalid_email',
			__( 'Indirizzo email non valido o mancante.', 'sara-consent-registry' ),
			array( 'status' => 400 )
		);
	}

	$first_name = isset( $params['first_name'] ) ? sanitize_text_field( (string) $params['first_name'] ) : '';
	$last_name  = isset( $params['last_name'] ) ? sanitize_text_field( (string) $params['last_name'] ) : '';

	if ( '' === $first_name && ! empty( $params['name'] ) ) {
		$name_parts = preg_split( '/\s+/', trim( sanitize_text_field( (string) $params['name'] ) ) );
		$name_parts = is_array( $name_parts ) ? array_filter( $name_parts ) : array();
		$name_parts = array_values( $name_parts );

		$first_name = isset( $name_parts[0] ) ? $name_parts[0] : '';
		$last_name  = count( $name_parts ) > 1 ? implode( ' ', array_slice( $name_parts, 1 ) ) : '';
	}

	if ( '' === $first_name ) {
		$first_name = 'Sposa/Sposo';
	}

	$wedding_date = '';
	if ( ! empty( $params['wedding_date'] ) ) {
		$wedding_date = sanitize_text_field( (string) $params['wedding_date'] );
	} elseif ( ! empty( $params['date'] ) ) {
		$wedding_date = sanitize_text_field( (string) $params['date'] );
	}

	$phone    = isset( $params['phone'] ) ? sanitize_text_field( (string) $params['phone'] ) : '';
	$location = isset( $params['location'] ) ? sanitize_text_field( (string) $params['location'] ) : '';
	$guests   = isset( $params['guests'] ) ? sanitize_text_field( (string) $params['guests'] ) : '';
	$budget   = isset( $params['budget'] ) ? sanitize_text_field( (string) $params['budget'] ) : '';
	$message  = isset( $params['message'] ) ? sanitize_textarea_field( (string) $params['message'] ) : '';
	$notes    = isset( $params['notes'] ) ? sanitize_textarea_field( (string) $params['notes'] ) : '';
	$source   = isset( $params['source'] ) ? sanitize_text_field( (string) $params['source'] ) : 'Landing Wedding';
	$status   = isset( $params['status'] ) ? sanitize_key( (string) $params['status'] ) : 'nuovo';

	if ( '' === $source ) {
		$source = 'Landing Wedding';
	}

	if ( '' === $status ) {
		$status = 'nuovo';
	}

	$metadata_json = null;
	if ( isset( $params['metadata'] ) ) {
		$metadata = $params['metadata'];

		if ( is_string( $metadata ) ) {
			$decoded = json_decode( $metadata, true );
			$metadata = ( JSON_ERROR_NONE === json_last_error() ) ? $decoded : array( 'raw' => $metadata );
		}

		if ( is_array( $metadata ) || is_object( $metadata ) ) {
			$metadata_json = wp_json_encode( $metadata );
		}
	}

	$lead = array(
		'first_name'   => $first_name,
		'last_name'    => $last_name,
		'email'        => $email,
		'phone'        => $phone,
		'wedding_date' => $wedding_date,
		'location'     => $location,
		'guests'       => $guests,
		'budget'       => $budget,
		'message'      => $message,
		'notes'        => $notes,
		'source'       => $source,
		'status'       => $status,
		'metadata'     => $metadata_json,
	);

	$inserted = $wpdb->insert(
		sara_leads_get_table_name(),
		array(
			'first_name'   => $lead['first_name'],
			'last_name'    => $lead['last_name'],
			'email'        => $lead['email'],
			'phone'        => $lead['phone'],
			'wedding_date' => $lead['wedding_date'],
			'location'     => $lead['location'],
			'guests'       => $lead['guests'],
			'budget'       => $lead['budget'],
			'message'      => $lead['message'],
			'notes'        => $lead['notes'],
			'source'       => $lead['source'],
			'status'       => $lead['status'],
			'metadata'     => $lead['metadata'],
			'created_at'   => current_time( 'mysql' ),
		),
		array( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
	);

	if ( false === $inserted ) {
		return new WP_Error(
			'sara_leads_db_error',
			__( 'Impossibile registrare la richiesta.', 'sara-consent-registry' ),
			array( 'status' => 500 )
		);
	}

	$lead_id = (int) $wpdb->insert_id;

	// Fire-and-forget: a mail failure must never invalidate the stored lead.
	sara_leads_send_notification_email( $lead );

	return new WP_REST_Response(
		array(
			'success' => true,
			'lead_id' => $lead_id,
		),
		201
	);
}

/* -------------------------------------------------------------------------
 * Admin page
 * ---------------------------------------------------------------------- */

/**
 * Register the top-level admin menu entry.
 *
 * @return void
 */
function sara_gdpr_register_menu() {
	add_menu_page(
		__( 'Registro Consensi GDPR', 'sara-consent-registry' ),
		__( 'Consensi GDPR', 'sara-consent-registry' ),
		'manage_options',
		'sara-gdpr-consents',
		'sara_gdpr_render_admin_page',
		'dashicons-shield',
		30
	);

	add_submenu_page(
		'sara-gdpr-consents',
		__( 'Richieste Sposi (Leads)', 'sara-consent-registry' ),
		__( 'Richieste Sposi', 'sara-consent-registry' ),
		'manage_options',
		'sara-leads',
		'sara_leads_render_admin_page'
	);
}
add_action( 'admin_menu', 'sara_gdpr_register_menu' );

/**
 * Build a human readable label for a consent type.
 *
 * @param string $consent_type Raw consent type.
 * @return string
 */
function sara_gdpr_consent_type_label( $consent_type ) {
	$labels = array(
		'all'       => __( 'Tutti i cookie', 'sara-consent-registry' ),
		'necessary' => __( 'Solo tecnici', 'sara-consent-registry' ),
		'custom'    => __( 'Personalizzati', 'sara-consent-registry' ),
	);

	return isset( $labels[ $consent_type ] ) ? $labels[ $consent_type ] : ucfirst( $consent_type );
}

/**
 * Render the consents registry admin page.
 *
 * @return void
 */
function sara_gdpr_render_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Non hai i permessi per accedere a questa pagina.', 'sara-consent-registry' ) );
	}

	global $wpdb;

	$table = sara_gdpr_get_table_name();

	$total       = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	$total_today = (int) $wpdb->get_var(
		$wpdb->prepare(
			"SELECT COUNT(*) FROM {$table} WHERE DATE(created_at) = %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			current_time( 'Y-m-d' )
		)
	);

	$distribution = array(
		'all'       => 0,
		'necessary' => 0,
		'custom'    => 0,
	);

	$grouped = $wpdb->get_results( "SELECT consent_type, COUNT(*) AS total FROM {$table} GROUP BY consent_type", OBJECT_K ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

	if ( is_array( $grouped ) ) {
		foreach ( $grouped as $consent_type => $row ) {
			$distribution[ $consent_type ] = (int) $row->total;
		}
	}

	$rows = $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 50" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Registro Consensi GDPR', 'sara-consent-registry' ); ?></h1>
		<p><?php esc_html_e( 'Registro elettronico dei consensi cookie e privacy ai sensi delle Linee Guida del Garante Privacy del 10/06/2021.', 'sara-consent-registry' ); ?></p>

		<div style="display:flex; flex-wrap:wrap; gap:16px; margin:20px 0;">
			<div style="flex:1 1 200px; background:#fff; border:1px solid #dcdcde; border-left:4px solid #2271b1; padding:16px 20px; border-radius:4px;">
				<div style="font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#646970;"><?php esc_html_e( 'Consensi totali', 'sara-consent-registry' ); ?></div>
				<div style="font-size:32px; font-weight:600; line-height:1.2;"><?php echo esc_html( number_format_i18n( $total ) ); ?></div>
			</div>
			<div style="flex:1 1 200px; background:#fff; border:1px solid #dcdcde; border-left:4px solid #00a32a; padding:16px 20px; border-radius:4px;">
				<div style="font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#646970;"><?php esc_html_e( 'Consensi oggi', 'sara-consent-registry' ); ?></div>
				<div style="font-size:32px; font-weight:600; line-height:1.2;"><?php echo esc_html( number_format_i18n( $total_today ) ); ?></div>
			</div>
			<div style="flex:2 1 360px; background:#fff; border:1px solid #dcdcde; border-left:4px solid #d63638; padding:16px 20px; border-radius:4px;">
				<div style="font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#646970;"><?php esc_html_e( 'Distribuzione', 'sara-consent-registry' ); ?></div>
				<div style="font-size:15px; line-height:1.8;">
					<?php esc_html_e( 'Tutti i cookie', 'sara-consent-registry' ); ?>: <strong><?php echo esc_html( number_format_i18n( $distribution['all'] ) ); ?></strong><br />
					<?php esc_html_e( 'Solo tecnici', 'sara-consent-registry' ); ?>: <strong><?php echo esc_html( number_format_i18n( $distribution['necessary'] ) ); ?></strong><br />
					<?php esc_html_e( 'Personalizzati', 'sara-consent-registry' ); ?>: <strong><?php echo esc_html( number_format_i18n( $distribution['custom'] ) ); ?></strong>
				</div>
			</div>
		</div>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:20px 0;">
			<input type="hidden" name="action" value="sara_gdpr_export_csv" />
			<?php wp_nonce_field( 'sara_gdpr_export_csv_action', 'sara_gdpr_nonce' ); ?>
			<button type="submit" class="button button-primary">
				<?php esc_html_e( 'Esporta Registro in CSV', 'sara-consent-registry' ); ?>
			</button>
		</form>

		<h2><?php esc_html_e( 'Ultimi 50 consensi registrati', 'sara-consent-registry' ); ?></h2>
		<table class="widefat striped">
			<thead>
				<tr>
					<th scope="col"><?php esc_html_e( 'Data e Ora', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'ID Anonimo', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Tipo Consenso', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Categorie', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'IP Anonimizzato', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'User Agent', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Versione Policy', 'sara-consent-registry' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php if ( empty( $rows ) ) : ?>
					<tr>
						<td colspan="7"><?php esc_html_e( 'Nessun consenso registrato.', 'sara-consent-registry' ); ?></td>
					</tr>
				<?php else : ?>
					<?php foreach ( $rows as $row ) : ?>
						<?php
						$categories_decoded = json_decode( (string) $row->categories, true );
						$categories_label   = sara_gdpr_format_categories( is_array( $categories_decoded ) ? $categories_decoded : array() );
						?>
						<tr>
							<td><?php echo esc_html( mysql2date( 'd/m/Y H:i:s', $row->created_at ) ); ?></td>
							<td><code><?php echo esc_html( $row->anonymous_id ); ?></code></td>
							<td><?php echo esc_html( sara_gdpr_consent_type_label( $row->consent_type ) ); ?></td>
							<td><?php echo esc_html( $categories_label ); ?></td>
							<td><code><?php echo esc_html( $row->ip_hash ); ?></code></td>
							<td><?php echo esc_html( wp_trim_words( (string) $row->user_agent, 12, '…' ) ); ?></td>
							<td><?php echo esc_html( $row->policy_version ); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
	<?php
}

/**
 * Format a categories array as a readable "label: on/off" string.
 *
 * @param array $categories Decoded categories.
 * @return string
 */
function sara_gdpr_format_categories( $categories ) {
	$parts = array();

	foreach ( $categories as $key => $value ) {
		$parts[] = $key . ': ' . ( $value ? 'on' : 'off' );
	}

	return implode( ', ', $parts );
}

/* -------------------------------------------------------------------------
 * Wedding leads admin page
 * ---------------------------------------------------------------------- */

/**
 * Build a coloured status badge for a wedding lead.
 *
 * @param string $status Raw status slug.
 * @return string Safe HTML badge.
 */
function sara_leads_status_badge( $status ) {
	$labels = array(
		'nuovo'      => array( 'Nuovo', '#2271b1', '#e7f0f7' ),
		'contattato' => array( 'Contattato', '#94660c', '#fbf3e0' ),
		'preventivo' => array( 'Preventivo', '#6d4c9f', '#f1ebfa' ),
		'chiuso'     => array( 'Chiuso', '#1a7f37', '#e6f4ea' ),
		'perso'      => array( 'Perso', '#b32d2e', '#fbeaea' ),
	);

	$key = sanitize_key( (string) $status );

	if ( ! isset( $labels[ $key ] ) ) {
		$labels[ $key ] = array( ucfirst( $key ), '#50575e', '#f0f0f1' );
	}

	list( $label, $color, $bg ) = $labels[ $key ];

	return '<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;color:' . esc_attr( $color ) . ';background:' . esc_attr( $bg ) . ';">' . esc_html( $label ) . '</span>';
}

/**
 * Format the metadata JSON as a readable block.
 *
 * @param string $metadata Raw JSON.
 * @return string Escaped HTML.
 */
function sara_leads_format_metadata( $metadata ) {
	if ( empty( $metadata ) ) {
		return '—';
	}

	$decoded = json_decode( (string) $metadata, true );

	if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
		return esc_html( (string) $metadata );
	}

	$parts = array();
	foreach ( $decoded as $key => $value ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			$value = wp_json_encode( $value );
		}
		$parts[] = '<strong>' . esc_html( $key ) . ':</strong> ' . esc_html( (string) $value );
	}

	return implode( '<br />', $parts );
}

/**
 * Render the wedding leads ("Richieste Sposi") admin page.
 *
 * @return void
 */
function sara_leads_render_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Non hai i permessi per accedere a questa pagina.', 'sara-consent-registry' ) );
	}

	global $wpdb;

	$table = sara_leads_get_table_name();

	if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) !== $table ) {
		echo '<div class="wrap"><h1>' . esc_html__( 'Richieste Sposi', 'sara-consent-registry' ) . '</h1>';
		echo '<div class="notice notice-error"><p>' . esc_html__( 'La tabella delle richieste non esiste ancora. Disattiva e riattiva il plugin per crearla.', 'sara-consent-registry' ) . '</p></div></div>';
		return;
	}

	$total       = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	$total_today = (int) $wpdb->get_var(
		$wpdb->prepare(
			"SELECT COUNT(*) FROM {$table} WHERE DATE(created_at) = %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			current_time( 'Y-m-d' )
		)
	);
	$total_new   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table} WHERE status = 'nuovo'" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

	$rows = $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 500" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Richieste Sposi (Leads)', 'sara-consent-registry' ); ?></h1>
		<p><?php esc_html_e( 'Tutte le richieste di contatto arrivate dalla landing page wedding.saradangelo.it, ordinate dalla più recente.', 'sara-consent-registry' ); ?></p>

		<div style="display:flex; flex-wrap:wrap; gap:16px; margin:20px 0;">
			<div style="flex:1 1 180px; background:#fff; border:1px solid #dcdcde; border-left:4px solid #2271b1; padding:16px 20px; border-radius:4px;">
				<div style="font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#646970;"><?php esc_html_e( 'Richieste totali', 'sara-consent-registry' ); ?></div>
				<div style="font-size:32px; font-weight:600; line-height:1.2;"><?php echo esc_html( number_format_i18n( $total ) ); ?></div>
			</div>
			<div style="flex:1 1 180px; background:#fff; border:1px solid #dcdcde; border-left:4px solid #00a32a; padding:16px 20px; border-radius:4px;">
				<div style="font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#646970;"><?php esc_html_e( 'Ricevute oggi', 'sara-consent-registry' ); ?></div>
				<div style="font-size:32px; font-weight:600; line-height:1.2;"><?php echo esc_html( number_format_i18n( $total_today ) ); ?></div>
			</div>
			<div style="flex:1 1 180px; background:#fff; border:1px solid #dcdcde; border-left:4px solid #d63638; padding:16px 20px; border-radius:4px;">
				<div style="font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#646970;"><?php esc_html_e( 'Da gestire (nuovo)', 'sara-consent-registry' ); ?></div>
				<div style="font-size:32px; font-weight:600; line-height:1.2;"><?php echo esc_html( number_format_i18n( $total_new ) ); ?></div>
			</div>
		</div>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:20px 0;">
			<input type="hidden" name="action" value="sara_leads_export_csv" />
			<?php wp_nonce_field( 'sara_leads_export_csv_action', 'sara_leads_nonce' ); ?>
			<button type="submit" class="button button-primary">
				<?php esc_html_e( 'Esporta CSV Richieste', 'sara-consent-registry' ); ?>
			</button>
		</form>

		<h2><?php esc_html_e( 'Richieste ricevute', 'sara-consent-registry' ); ?></h2>
		<table class="widefat striped">
			<thead>
				<tr>
					<th scope="col"><?php esc_html_e( 'Data', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Sposi', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Contatti', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Nozze', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Invitati', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Location', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Budget', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Messaggio', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Stato', 'sara-consent-registry' ); ?></th>
					<th scope="col"><?php esc_html_e( 'Note interne', 'sara-consent-registry' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php if ( empty( $rows ) ) : ?>
					<tr>
						<td colspan="10"><?php esc_html_e( 'Nessuna richiesta ricevuta finora.', 'sara-consent-registry' ); ?></td>
					</tr>
				<?php else : ?>
					<?php foreach ( $rows as $row ) : ?>
						<?php
						$couple_name  = trim( $row->first_name . ' ' . $row->last_name );
						$phone_digits = sara_leads_normalize_phone( $row->phone );
						$metadata_out = sara_leads_format_metadata( $row->metadata );
						?>
						<tr>
							<td>
								<?php echo esc_html( mysql2date( 'd/m/Y H:i', $row->created_at ) ); ?>
								<?php if ( ! empty( $row->source ) ) : ?>
									<br /><small style="color:#646970;"><?php echo esc_html( $row->source ); ?></small>
								<?php endif; ?>
							</td>
							<td>
								<strong><?php echo esc_html( '' !== $couple_name ? $couple_name : '—' ); ?></strong>
								<?php if ( ! empty( $metadata_out ) && '—' !== $metadata_out ) : ?>
									<details style="margin-top:6px;">
										<summary style="cursor:pointer;color:#2271b1;font-size:12px;"><?php esc_html_e( 'Dettagli', 'sara-consent-registry' ); ?></summary>
										<div style="margin-top:6px;font-size:12px;color:#50575e;line-height:1.6;"><?php echo wp_kses_post( $metadata_out ); ?></div>
									</details>
								<?php endif; ?>
							</td>
							<td>
								<?php if ( ! empty( $row->email ) ) : ?>
									<a href="mailto:<?php echo esc_attr( $row->email ); ?>"><?php echo esc_html( $row->email ); ?></a>
								<?php endif; ?>
								<?php if ( ! empty( $row->phone ) ) : ?>
									<br />
									<?php if ( '' !== $phone_digits ) : ?>
										<a href="https://wa.me/<?php echo esc_attr( $phone_digits ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $row->phone ); ?></a>
									<?php else : ?>
										<?php echo esc_html( $row->phone ); ?>
									<?php endif; ?>
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( '' !== (string) $row->wedding_date ? $row->wedding_date : '—' ); ?></td>
							<td><?php echo esc_html( '' !== (string) $row->guests ? $row->guests : '—' ); ?></td>
							<td><?php echo esc_html( '' !== (string) $row->location ? $row->location : '—' ); ?></td>
							<td><?php echo esc_html( '' !== (string) $row->budget ? $row->budget : '—' ); ?></td>
							<td style="max-width:280px;"><?php echo '' !== (string) $row->message ? nl2br( esc_html( $row->message ) ) : '—'; ?></td>
							<td><?php echo wp_kses_post( sara_leads_status_badge( $row->status ) ); ?></td>
							<td style="max-width:220px;"><?php echo '' !== (string) $row->notes ? nl2br( esc_html( $row->notes ) ) : '—'; ?></td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * CSV export
 * ---------------------------------------------------------------------- */

/**
 * Handle the CSV export request for the Garante Privacy.
 *
 * @return void
 */
function sara_gdpr_export_csv() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Non hai i permessi per eseguire questa operazione.', 'sara-consent-registry' ) );
	}

	$nonce = isset( $_POST['sara_gdpr_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['sara_gdpr_nonce'] ) ) : '';

	if ( ! wp_verify_nonce( $nonce, 'sara_gdpr_export_csv_action' ) ) {
		wp_die( esc_html__( 'Verifica di sicurezza fallita. Ricarica la pagina e riprova.', 'sara-consent-registry' ) );
	}

	global $wpdb;

	$table    = sara_gdpr_get_table_name();
	$filename = 'registro_consensi_garante_' . gmdate( 'Y-m-d' ) . '.csv';

	nocache_headers();
	header( 'Content-Type: text/csv; charset=UTF-8' );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	header( 'Pragma: no-cache' );
	header( 'Expires: 0' );

	$output = fopen( 'php://output', 'w' );

	if ( false === $output ) {
		wp_die( esc_html__( 'Impossibile generare il file CSV.', 'sara-consent-registry' ) );
	}

	// UTF-8 BOM for correct Excel rendering of accented characters.
	fwrite( $output, "\xEF\xBB\xBF" );

	$delimiter = ';';

	fputcsv(
		$output,
		array(
			'ID',
			'Data e Ora',
			'ID Anonimo',
			'Tipo Consenso',
			'Categorie',
			'IP Anonimizzato (SHA-256)',
			'User Agent',
			'Versione Policy',
		),
		$delimiter
	);

	$limit  = 1000;
	$offset = 0;

	do {
		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d OFFSET %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$limit,
				$offset
			)
		);

		if ( empty( $rows ) ) {
			break;
		}

		foreach ( $rows as $row ) {
			$categories_decoded = json_decode( (string) $row->categories, true );
			$categories_label   = sara_gdpr_format_categories( is_array( $categories_decoded ) ? $categories_decoded : array() );

			fputcsv(
				$output,
				array(
					(int) $row->id,
					mysql2date( 'd/m/Y H:i:s', $row->created_at ),
					$row->anonymous_id,
					sara_gdpr_consent_type_label( $row->consent_type ),
					$categories_label,
					$row->ip_hash,
					$row->user_agent,
					$row->policy_version,
				),
				$delimiter
			);
		}

		$offset += $limit;
	} while ( count( $rows ) === $limit );

	fclose( $output );
	exit;
}
add_action( 'admin_post_sara_gdpr_export_csv', 'sara_gdpr_export_csv' );

/* -------------------------------------------------------------------------
 * Wedding leads CSV export
 * ---------------------------------------------------------------------- */

/**
 * Handle the CSV export request for the wedding leads.
 *
 * @return void
 */
function sara_leads_export_csv() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Non hai i permessi per eseguire questa operazione.', 'sara-consent-registry' ) );
	}

	$nonce = isset( $_POST['sara_leads_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['sara_leads_nonce'] ) ) : '';

	if ( ! wp_verify_nonce( $nonce, 'sara_leads_export_csv_action' ) ) {
		wp_die( esc_html__( 'Verifica di sicurezza fallita. Ricarica la pagina e riprova.', 'sara-consent-registry' ) );
	}

	global $wpdb;

	$table    = sara_leads_get_table_name();
	$filename = 'richieste_sposi_' . gmdate( 'Y-m-d' ) . '.csv';

	nocache_headers();
	header( 'Content-Type: text/csv; charset=UTF-8' );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	header( 'Pragma: no-cache' );
	header( 'Expires: 0' );

	$output = fopen( 'php://output', 'w' );

	if ( false === $output ) {
		wp_die( esc_html__( 'Impossibile generare il file CSV.', 'sara-consent-registry' ) );
	}

	// UTF-8 BOM for correct Excel rendering of accented characters.
	fwrite( $output, "\xEF\xBB\xBF" );

	$delimiter = ';';

	fputcsv(
		$output,
		array(
			'ID',
			'Data e Ora',
			'Nome',
			'Cognome',
			'Email',
			'Telefono',
			'Data Nozze',
			'Invitati',
			'Location',
			'Budget',
			'Messaggio',
			'Note',
			'Provenienza',
			'Stato',
			'Metadata',
		),
		$delimiter
	);

	$limit  = 1000;
	$offset = 0;

	do {
		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d OFFSET %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$limit,
				$offset
			)
		);

		if ( empty( $rows ) ) {
			break;
		}

		foreach ( $rows as $row ) {
			fputcsv(
				$output,
				array(
					(int) $row->id,
					mysql2date( 'd/m/Y H:i:s', $row->created_at ),
					$row->first_name,
					$row->last_name,
					$row->email,
					$row->phone,
					$row->wedding_date,
					$row->guests,
					$row->location,
					$row->budget,
					$row->message,
					$row->notes,
					$row->source,
					$row->status,
					$row->metadata,
				),
				$delimiter
			);
		}

		$offset += $limit;
	} while ( count( $rows ) === $limit );

	fclose( $output );
	exit;
}
add_action( 'admin_post_sara_leads_export_csv', 'sara_leads_export_csv' );
