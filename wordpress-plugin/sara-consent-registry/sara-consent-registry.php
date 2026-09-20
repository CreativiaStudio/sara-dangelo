<?php
/**
 * Plugin Name:       Sara D'Angelo - Registro Consensi GDPR
 * Description:       Registro elettronico dei consensi cookie e privacy conforme al Garante Privacy (Linee Guida 10/06/2021). Riceve consensi via REST API da wedding.saradangelo.it e fornisce interfaccia con export CSV per il Garante.
 * Version:           1.0.0
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

define( 'SARA_GDPR_VERSION', '1.0.0' );
define( 'SARA_GDPR_TABLE', 'sara_cookie_consents' );
define( 'SARA_GDPR_NAMESPACE', 'sara-gdpr/v1' );
define( 'SARA_GDPR_ALLOWED_ORIGIN', 'https://wedding.saradangelo.it' );
define( 'SARA_GDPR_DEFAULT_POLICY_VERSION', 'v1.0' );

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
 * Create (or upgrade) the consents table on activation.
 *
 * @return void
 */
function sara_gdpr_activate() {
	global $wpdb;

	$table_name      = sara_gdpr_get_table_name();
	$charset_collate = $wpdb->get_charset_collate();

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

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );

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
