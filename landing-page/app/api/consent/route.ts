import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const WP_CONSENT_ENDPOINT = "https://www.saradangelo.it/wp-json/sara-gdpr/v1/log";
const DEFAULT_POLICY_VERSION = "v1.0";
const FORWARD_TIMEOUT_MS = 4000;

interface ConsentCategories {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

interface ForwardPayload {
  anonymous_id: string;
  consent_type: string;
  categories: ConsentCategories;
  policy_version: string;
  ip_hash?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function extractClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  return request.headers.get("x-real-ip")?.trim() ?? "";
}

function hashIp(ip: string): string {
  if (!ip) {
    return "";
  }
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Corpo della richiesta non valido." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ success: false, error: "Payload non valido." }, { status: 400 });
  }

  const anonymousId = readString(body.anonymous_id);
  const consentType = readString(body.consent_type);

  if (!anonymousId || !consentType) {
    return NextResponse.json(
      { success: false, error: "I campi anonymous_id e consent_type sono obbligatori." },
      { status: 400 }
    );
  }

  const rawCategories = isRecord(body.categories) ? body.categories : {};
  const categories: ConsentCategories = {
    necessary: true,
    analytics: rawCategories.analytics === true,
    marketing: rawCategories.marketing === true,
  };

  const policyVersion = readString(body.policy_version) || DEFAULT_POLICY_VERSION;
  const ipHash = hashIp(extractClientIp(request));

  const forwardPayload: ForwardPayload = {
    anonymous_id: anonymousId,
    consent_type: consentType,
    categories,
    policy_version: policyVersion,
    ...(ipHash ? { ip_hash: ipHash } : {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);

  try {
    const wpResponse = await fetch(WP_CONSENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(forwardPayload),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!wpResponse.ok) {
      return NextResponse.json({ success: true, cached: true }, { status: 200 });
    }

    return NextResponse.json({ success: true, forwarded: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: true, cached: true }, { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}
