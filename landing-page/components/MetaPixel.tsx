"use client";

import { useEffect, useRef } from "react";

/**
 * Meta (Facebook) Pixel — browser side of the hybrid tracking architecture.
 *
 * GDPR: the pixel is loaded and initialised ONLY when the visitor has granted
 * the "marketing" consent category through CookieConsentBanner. The banner
 * persists the decision in `localStorage` under `sda_cookie_consent` and emits
 * the `sda_consent_updated` event (plus the native `storage` event across tabs)
 * whenever the preference changes.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1737630666397630";

const CONSENT_STORAGE_KEY = "sda_cookie_consent";
const CONSENT_UPDATED_EVENT = "sda_consent_updated";
const FBEVENTS_SRC = "https://connect.facebook.net/en_US/fbevents.js";

/**
 * Minimal, dependency-free shape of the `fbq` command queue exposed by
 * fbevents.js. Before the remote script is ready `fbq` is a stub that buffers
 * calls; afterwards fbevents.js attaches `callMethod` and flushes the queue.
 */
export type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: FbqFunction;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw) as {
      categories?: { marketing?: unknown };
    } | null;
    return parsed?.categories?.marketing === true;
  } catch {
    return false;
  }
}

/**
 * Injects the official fbevents.js loader. Kept idempotent so React strict
 * mode (double effect invocation) can never register the pixel twice.
 */
function injectFbevents(): void {
  if (typeof window === "undefined" || window.fbq) {
    return;
  }

  const fbq = function (...args: unknown[]) {
    if (typeof fbq.callMethod === "function") {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  } as FbqFunction;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = FBEVENTS_SRC;
  document.head.appendChild(script);
}

export default function MetaPixel() {
  const initialized = useRef(false);

  useEffect(() => {
    const syncConsent = () => {
      if (hasMarketingConsent()) {
        if (initialized.current) {
          return;
        }
        initialized.current = true;

        injectFbevents();

        const fbq = window.fbq;
        if (typeof fbq !== "function") {
          return;
        }

        fbq("consent", "grant");
        fbq("init", META_PIXEL_ID);
        fbq("track", "PageView");
        return;
      }

      // Consent revoked / never granted: make sure an already-loaded pixel
      // stops sending data.
      if (typeof window.fbq === "function") {
        window.fbq("consent", "revoke");
      }
    };

    syncConsent();

    window.addEventListener("storage", syncConsent);
    window.addEventListener(CONSENT_UPDATED_EVENT, syncConsent);

    return () => {
      window.removeEventListener("storage", syncConsent);
      window.removeEventListener(CONSENT_UPDATED_EVENT, syncConsent);
    };
  }, []);

  return null;
}
