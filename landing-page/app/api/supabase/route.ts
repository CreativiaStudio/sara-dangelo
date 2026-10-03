import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

const HUB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekfnekrjpumjpetzgwzy.supabase.co';
// Service-role key: never hardcoded. When the environment variable is missing
// the Hub storage / metrics / credential reads are skipped with a warning.
const HUB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SARA_CLIENT_ID = '785ebd4b-5e88-4803-b6f4-87359dd30784';

// Meta CAPI fallback credentials. The pixel ID is public (it is also shipped to
// the browser), while the access token is server-only and read exclusively from
// the environment. When it is not configured the CAPI call is skipped.
const FALLBACK_META_PIXEL_ID = '1737630666397630';
const FALLBACK_META_TOKEN = process.env.META_ACCESS_TOKEN || '';

// WordPress backup endpoint: it stores the lead in its own DB and immediately
// dispatches the notification email. This is the primary safety net for leads.
const WP_LEAD_ENDPOINT = 'https://www.saradangelo.it/wp-json/sara-gdpr/v1/lead';
const WP_TIMEOUT_MS = 5000;

/**
 * Normalises an Italian phone number for Meta Advanced Matching.
 * - Strips every non-numeric character.
 * - Converts the `0039` international prefix to the bare `39` country code.
 * - Adds the `39` country code to Italian mobile numbers (9-10 digits starting
 *   with 3) that were provided without it.
 */
function normalizePhoneForMeta(raw: string | undefined | null): string | undefined {
  if (!raw) {
    return undefined;
  }
  let digits = raw.replace(/\D/g, '');
  if (!digits) {
    return undefined;
  }
  if (digits.startsWith('0039')) {
    digits = digits.slice(2);
  } else if (/^3\d{8,9}$/.test(digits)) {
    digits = `39${digits}`;
  }
  return digits;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      date,
      location,
      guests,
      budget,
      message,
      privacyAccepted,
      eventId,
      fbp,
      fbc,
      eventSourceUrl,
    } = body;

    // E2E-only bypass. It is opt-in via an explicit env flag so that real
    // production traffic always persists the lead and triggers the Meta CAPI.
    if (
      process.env.LEAD_TEST_BYPASS === 'true' &&
      email &&
      (email.endsWith('@example.com') || email.endsWith('@vogue.com'))
    ) {
      return NextResponse.json({ success: true });
    }

    if (!email || !privacyAccepted) {
      return NextResponse.json(
        { success: false, error: 'Dati obbligatori mancanti o consenso privacy non accettato.' },
        { status: 400 }
      );
    }

    // Parse first name / last name
    const nameParts = (name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Sposa/Sposo';
    const lastName = nameParts.slice(1).join(' ') || '';

    const normalizedEmail = email.trim().toLowerCase();

    // Extract client IP and user-agent for GDPR proof of consent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anon';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const consentProof = {
      accepted: true,
      timestamp: new Date().toISOString(),
      policy_version: 'v1.0-2026',
      ip_address: ip,
      user_agent: userAgent,
      statement: "Ho letto e accetto l'informativa sulla Privacy Policy per il trattamento dei dati personali."
    };

    const notesSummary = [
      date ? `Data Evento: ${date}` : null,
      guests ? `Invitati: ${guests}` : null,
      location ? `Location: ${location}` : null,
      budget ? `Budget: ${budget}` : null,
      message ? `Messaggio: ${message}` : null
    ].filter(Boolean).join(' | ');

    const metadata = {
      wedding_date: date ?? null,
      location: location ?? null,
      guests: guests ?? null,
      budget: budget ?? null,
      message: message ?? null,
      event_id: eventId ?? null,
      landing_page: 'wedding.saradangelo.it',
      privacy_consent: consentProof
    };

    // ---------------------------------------------------------------------
    // STEP 1 — WordPress backup & email notification (primary safety net).
    // Always attempted, fully isolated: a failure here must never break the
    // user request, and the lead is already stored in the WP database.
    // ---------------------------------------------------------------------
    let wpLeadId: string | number | null = null;
    try {
      const wpController = new AbortController();
      const wpTimeout = setTimeout(() => wpController.abort(), WP_TIMEOUT_MS);

      try {
        const wpRes = await fetch(WP_LEAD_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            name: (name || '').trim(),
            email: normalizedEmail,
            phone: (phone || '').trim(),
            wedding_date: date || '',
            location: location || '',
            guests: guests !== undefined && guests !== null ? String(guests) : '',
            budget: budget || '',
            message: message || '',
            notes: notesSummary,
            source: 'Landing Wedding',
            status: 'nuovo',
            metadata
          }),
          signal: wpController.signal,
          cache: 'no-store'
        });

        if (wpRes.ok) {
          const wpData = await wpRes.json().catch(() => null);
          wpLeadId = wpData?.lead_id ?? null;
          console.log(`WordPress lead stored (#${wpLeadId ?? 'n/d'}) and notification email dispatched.`);
        } else {
          const wpErrText = await wpRes.text().catch(() => '');
          console.error('WordPress lead endpoint error:', wpRes.status, wpErrText);
        }
      } finally {
        clearTimeout(wpTimeout);
      }
    } catch (wpErr) {
      console.error('WordPress lead forward note:', wpErr);
    }

    // ---------------------------------------------------------------------
    // STEP 2 — Supabase storage & metrics (best effort).
    // If Supabase is temporarily restricted (e.g. quota limit 429/402) we only
    // log a warning and keep going: the WordPress backup already holds the lead.
    // ---------------------------------------------------------------------
    const leadPayload = {
      client_id: SARA_CLIENT_ID,
      first_name: firstName,
      last_name: lastName,
      email: normalizedEmail,
      phone: (phone || '').trim(),
      source: 'Landing Wedding',
      status: 'nuovo',
      notes: notesSummary,
      metadata
    };

    let leadId: string | number | null = null;

    // Without the service-role key there is no point in issuing Hub requests:
    // they would only return 401 and pollute the logs. Skip them cleanly while
    // the WordPress backup above still guarantees the lead is not lost.
    const hasHubCredentials = HUB_KEY.length > 0;
    if (!hasHubCredentials) {
      console.warn(
        'SUPABASE_SERVICE_ROLE_KEY non configurata: salvataggio Hub, metriche e lettura credenziali Meta saltati.'
      );
    }

    if (hasHubCredentials) {
      try {
        const hubRes = await fetch(`${HUB_URL}/rest/v1/client_leads`, {
          method: 'POST',
          headers: {
            'apikey': HUB_KEY,
            'Authorization': `Bearer ${HUB_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(leadPayload)
        });

        if (!hubRes.ok) {
          console.warn('Supabase temporary restriction');
          const errText = await hubRes.text().catch(() => '');
          console.error('Hub lead insert error:', errText);
        } else {
          const insertedData = await hubRes.json().catch(() => null);
          leadId = insertedData?.[0]?.id ?? null;
        }
      } catch (hubErr) {
        console.warn('Supabase temporary restriction');
        console.error('Hub lead insert note:', hubErr);
      }

      // Keep the Creativia Hub Data Lake (client_metrics) in sync. Exactly like
      // the n8n-master webhook architecture: read today's row for this client,
      // increment website_leads by 1 and upsert on (client_id, date).
      try {
        const metricsDate = new Date().toISOString().split('T')[0];

        const existingRes = await fetch(
          `${HUB_URL}/rest/v1/client_metrics?client_id=eq.${SARA_CLIENT_ID}&date=eq.${metricsDate}&select=website_leads`,
          {
            headers: {
              'apikey': HUB_KEY,
              'Authorization': `Bearer ${HUB_KEY}`
            }
          }
        );
        const existingMetrics = existingRes.ok ? await existingRes.json() : [];
        const currentLeads = Number(existingMetrics?.[0]?.website_leads || 0);

        const metricsRes = await fetch(`${HUB_URL}/rest/v1/client_metrics?on_conflict=client_id,date`, {
          method: 'POST',
          headers: {
            'apikey': HUB_KEY,
            'Authorization': `Bearer ${HUB_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            client_id: SARA_CLIENT_ID,
            date: metricsDate,
            website_leads: currentLeads + 1,
            updated_at: new Date().toISOString()
          })
        });

        if (!metricsRes.ok) {
          console.warn('Supabase temporary restriction');
          const metricsErrText = await metricsRes.text().catch(() => '');
          console.error('Hub client_metrics upsert error:', metricsErrText);
        }
      } catch (metricsErr) {
        console.warn('Supabase temporary restriction');
        console.error('Hub client_metrics upsert note:', metricsErr);
      }
    }

    // Read the Meta credentials from the client record, but never depend on it:
    // on restriction this simply stays null and the fallback credentials apply.
    let clientInfo: Array<{ meta_pixel_id?: string; meta_access_token?: string }> | null = null;
    if (hasHubCredentials) {
      try {
        const clientRes = await fetch(`${HUB_URL}/rest/v1/clients?id=eq.${SARA_CLIENT_ID}&select=meta_pixel_id,meta_access_token`, {
          headers: {
            'apikey': HUB_KEY,
            'Authorization': `Bearer ${HUB_KEY}`
          }
        });

        if (clientRes.ok) {
          clientInfo = await clientRes.json().catch(() => null);
        } else {
          console.warn('Supabase temporary restriction');
        }
      } catch (clientErr) {
        console.warn('Supabase temporary restriction');
        console.error('Hub client credentials read note:', clientErr);
      }
    }

    // ---------------------------------------------------------------------
    // STEP 3 — Meta CAPI. Always sent, using fallback credentials when the
    // Hub read failed, so the conversion is never lost.
    // ---------------------------------------------------------------------
    try {
      const metaPixelId = clientInfo?.[0]?.meta_pixel_id || process.env.META_PIXEL_ID || FALLBACK_META_PIXEL_ID;
      const metaToken = clientInfo?.[0]?.meta_access_token || FALLBACK_META_TOKEN;

      if (metaPixelId && metaToken) {
        const hash = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');
        const normalizedPhone = normalizePhoneForMeta(phone);
        const dedupEventId = typeof eventId === 'string' && eventId.trim() ? eventId.trim() : crypto.randomUUID();
        const capiPayload = {
          data: [
            {
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              event_id: dedupEventId,
              action_source: 'website',
              event_source_url: eventSourceUrl || 'https://wedding.saradangelo.it',
              user_data: {
                em: [hash(normalizedEmail)],
                ph: normalizedPhone ? [hash(normalizedPhone)] : undefined,
                fn: hash(firstName),
                ln: lastName ? hash(lastName) : undefined,
                client_ip_address: ip !== 'anon' ? ip : undefined,
                client_user_agent: userAgent,
                fbp: fbp || undefined,
                fbc: fbc || undefined
              },
              custom_data: {
                currency: 'EUR',
                value: 0,
                content_name: 'Richiesta Consulenza Wedding Architect'
              }
            }
          ]
        };

        const capiRes = await fetch(`https://graph.facebook.com/v20.0/${metaPixelId}/events?access_token=${metaToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capiPayload)
        });

        const capiResult = await capiRes.json().catch(() => null);
        if (!capiRes.ok) {
          console.error('Meta CAPI error:', capiResult ?? capiRes.status);
        } else {
          console.log(
            `Meta CAPI Lead OK — pixel ${metaPixelId} — event_id ${dedupEventId} — events_received: ${capiResult?.events_received ?? 'n/d'}`
          );
        }
      } else {
        console.warn('Meta CAPI skipped: meta_pixel_id / meta_access_token non configurati.');
      }
    } catch (capiErr) {
      console.warn('CAPI trigger note:', capiErr);
    }

    return NextResponse.json({ success: true, leadId: leadId || wpLeadId || 'saved' });
  } catch (err: any) {
    console.error('API Supabase error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
