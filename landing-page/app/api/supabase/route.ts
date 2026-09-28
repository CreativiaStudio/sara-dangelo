import { NextResponse } from 'next/server';
import crypto from 'crypto';

const HUB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekfnekrjpumjpetzgwzy.supabase.co';
const HUB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZm5la3JqcHVtanBldHpnd3p5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzgyNjAxNiwiZXhwIjoyMDk5NDAyMDE2fQ.Ne-jtSPB8NP-79_pV1KsGubYbCDtQVhQAXRtC-PzT-8';
const SARA_CLIENT_ID = '785ebd4b-5e88-4803-b6f4-87359dd30784';

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

    // 1. Insert lead directly into Creativia Hub (client_leads)
    const leadPayload = {
      client_id: SARA_CLIENT_ID,
      first_name: firstName,
      last_name: lastName,
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      source: 'Landing Wedding',
      status: 'nuovo',
      notes: notesSummary,
      metadata: {
        wedding_date: date,
        location,
        guests,
        budget,
        message,
        privacy_consent: consentProof
      }
    };

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
      const errText = await hubRes.text();
      console.error('Hub lead insert error:', errText);
      return NextResponse.json({ success: false, error: 'Errore durante la registrazione del contatto.' }, { status: 500 });
    }

    const insertedData = await hubRes.json();
    const leadId = insertedData?.[0]?.id;

    // 2. Keep the Creativia Hub Data Lake (client_metrics) in sync.
    //    Exactly like the n8n-master webhook architecture: read today's row for
    //    this client, increment website_leads by 1 and upsert on (client_id, date).
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
        const metricsErrText = await metricsRes.text();
        console.error('Hub client_metrics upsert error:', metricsErrText);
      }
    } catch (metricsErr) {
      console.error('Hub client_metrics upsert note:', metricsErr);
    }

    // 3. Trigger Meta CAPI server-side (if Pixel & Access Token configured on client record in Hub)
    try {
      const clientRes = await fetch(`${HUB_URL}/rest/v1/clients?id=eq.${SARA_CLIENT_ID}&select=meta_pixel_id,meta_access_token`, {
        headers: {
          'apikey': HUB_KEY,
          'Authorization': `Bearer ${HUB_KEY}`
        }
      });
      const clientInfo = await clientRes.json();
      const metaPixelId = clientInfo?.[0]?.meta_pixel_id || process.env.META_PIXEL_ID;
      const metaToken = clientInfo?.[0]?.meta_access_token || process.env.META_ACCESS_TOKEN;

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
                em: [hash(email)],
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

    return NextResponse.json({ success: true, leadId });
  } catch (err: any) {
    console.error('API Supabase error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
