"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const CONSENT_STORAGE_KEY = "sda_cookie_consent";
const ANONYMOUS_ID_STORAGE_KEY = "sda_anonymous_id";
const POLICY_VERSION = "v1.0";
const CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;

type ConsentType = "all" | "necessary" | "custom";

interface ConsentCategories {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

interface StoredConsent {
  anonymous_id: string;
  consent_type: ConsentType;
  categories: ConsentCategories;
  policy_version: string;
  timestamp: number;
}

const DEFAULT_CATEGORIES: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function generateAnonymousId(): string {
  const cryptoObj = typeof globalThis === "undefined" ? undefined : globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `sda-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateAnonymousId(): string {
  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const created = generateAnonymousId();
    window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, created);
    return created;
  } catch {
    return generateAnonymousId();
  }
}

function isConsentCategories(value: unknown): value is ConsentCategories {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    candidate.necessary === true &&
    typeof candidate.analytics === "boolean" &&
    typeof candidate.marketing === "boolean"
  );
}

function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    if (
      typeof record.timestamp !== "number" ||
      typeof record.anonymous_id !== "string" ||
      !isConsentCategories(record.categories)
    ) {
      return null;
    }
    if (Date.now() - record.timestamp >= CONSENT_TTL_MS) {
      return null;
    }
    const consentType: ConsentType =
      record.consent_type === "all" ||
      record.consent_type === "necessary" ||
      record.consent_type === "custom"
        ? record.consent_type
        : "custom";
    return {
      anonymous_id: record.anonymous_id,
      consent_type: consentType,
      categories: record.categories,
      policy_version:
        typeof record.policy_version === "string" ? record.policy_version : POLICY_VERSION,
      timestamp: record.timestamp,
    };
  } catch {
    return null;
  }
}

let cachedRawConsent: string | null = null;
let cachedParsedConsent: StoredConsent | null = null;

function getConsentSnapshot(): StoredConsent | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRawConsent) {
    cachedRawConsent = raw;
    cachedParsedConsent = parseStoredConsent(raw);
  }
  return cachedParsedConsent;
}

function subscribeToConsent(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("sda_consent_updated", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("sda_consent_updated", onStoreChange);
  };
}

function subscribeToNothing(): () => void {
  return () => undefined;
}

const getClientSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;
const getServerConsent = (): StoredConsent | null => null;

interface ConsentToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

function ConsentToggle({
  id,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: ConsentToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className={`block text-sm tracking-wide ${
            disabled ? "text-[#FDFBF7]/85" : "cursor-pointer text-[#FDFBF7]"
          }`}
        >
          {title}
        </label>
        <p className="mt-0.5 text-xs leading-relaxed text-[#FDFBF7]/55">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E] ${
          checked ? "border-[#B89768] bg-[#B89768]" : "border-[#B89768]/40 bg-transparent"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full ${
            checked ? "right-1 bg-[#1A140E]" : "left-1 bg-[#B89768]"
          }`}
        />
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}

export default function CookieConsentBanner() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const isClient = useSyncExternalStore(subscribeToNothing, getClientSnapshot, getServerSnapshot);
  const storedConsent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsent
  );

  const [panelOverride, setPanelOverride] = useState<boolean | null>(null);
  const [analyticsOverride, setAnalyticsOverride] = useState<boolean | null>(null);
  const [marketingOverride, setMarketingOverride] = useState<boolean | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const analytics = analyticsOverride ?? storedConsent?.categories.analytics ?? false;
  const marketing = marketingOverride ?? storedConsent?.categories.marketing ?? false;
  const isOpen = panelOverride ?? (isClient && !storedConsent);

  const persistConsent = useCallback((consentType: ConsentType, categories: ConsentCategories) => {
    const anonymousId = getOrCreateAnonymousId();

    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          anonymous_id: anonymousId,
          consent_type: consentType,
          categories,
          policy_version: POLICY_VERSION,
          timestamp: Date.now(),
        } satisfies StoredConsent)
      );
    } catch {
      /* storage non disponibile: il consenso resta valido per la sessione corrente */
    }

    window.dispatchEvent(
      new CustomEvent<ConsentCategories>("sda_consent_updated", { detail: categories })
    );

    void fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonymous_id: anonymousId,
        consent_type: consentType,
        categories,
        policy_version: POLICY_VERSION,
      }),
      keepalive: true,
    }).catch(() => {
      /* chiamata non bloccante: un errore di rete non deve mai interrompere la navigazione */
    });
  }, []);

  const acceptAll = useCallback(() => {
    setAnalyticsOverride(true);
    setMarketingOverride(true);
    setPanelOverride(false);
    setShowDetails(false);
    persistConsent("all", { necessary: true, analytics: true, marketing: true });
  }, [persistConsent]);

  const rejectAll = useCallback(() => {
    setAnalyticsOverride(false);
    setMarketingOverride(false);
    setPanelOverride(false);
    setShowDetails(false);
    persistConsent("necessary", { necessary: true, analytics: false, marketing: false });
  }, [persistConsent]);

  const savePreferences = useCallback(() => {
    const categories: ConsentCategories = { necessary: true, analytics, marketing };
    let consentType: ConsentType = "custom";
    if (analytics && marketing) {
      consentType = "all";
    } else if (!analytics && !marketing) {
      consentType = "necessary";
    }
    setPanelOverride(false);
    setShowDetails(false);
    persistConsent(consentType, categories);
  }, [analytics, marketing, persistConsent]);

  const reopenPreferences = useCallback(() => {
    setAnalyticsOverride(storedConsent?.categories.analytics ?? DEFAULT_CATEGORIES.analytics);
    setMarketingOverride(storedConsent?.categories.marketing ?? DEFAULT_CATEGORIES.marketing);
    setShowDetails(true);
    setPanelOverride(true);
  }, [storedConsent]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sda-cookie-banner"
            role="dialog"
            aria-modal="false"
            aria-label="Preferenze cookie"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[9990] px-3 pb-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-md sm:px-0 sm:pb-0"
          >
            <div className="overflow-hidden border border-[#B89768]/35 bg-[#1A140E]/95 text-[#FDFBF7] shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#B89768]/70 to-transparent" />

              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="block text-[0.7rem] uppercase tracking-[0.28em] text-[#B89768]">
                      Privacy &amp; Cookie
                    </span>
                    <h2 className="mt-2 font-serif text-xl leading-snug text-[#FDFBF7] sm:text-2xl">
                      La tua privacy, curata nei dettagli
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={rejectAll}
                    aria-label="Chiudi e accetta solo i cookie necessari"
                    className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent text-[#FDFBF7]/60 transition-colors duration-300 hover:border-[#B89768]/40 hover:text-[#B89768] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <p className="mt-4 text-sm font-light leading-relaxed text-[#FDFBF7]/70">
                  Utilizziamo cookie tecnici necessari al funzionamento del sito e, con il tuo
                  consenso, cookie analitici e di profilazione per offrirti un&apos;esperienza su
                  misura. Puoi accettare tutti i cookie, proseguire con i soli cookie necessari
                  oppure personalizzare le tue preferenze.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="w-full cursor-pointer border border-[#B89768] bg-[#B89768] px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#1A140E] transition-colors duration-300 hover:bg-[#C9A97C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E]"
                  >
                    Accetta Tutti
                  </button>
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="w-full cursor-pointer border border-[#B89768]/70 bg-transparent px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#FDFBF7] transition-colors duration-300 hover:border-[#B89768] hover:bg-[#B89768]/12 hover:text-[#B89768] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E]"
                  >
                    Solo Tecnici / Rifiuta
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetails((value) => !value)}
                  aria-expanded={showDetails}
                  aria-controls="sda-cookie-preferences"
                  className="mt-2.5 w-full cursor-pointer border border-transparent px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-[#B89768] transition-colors duration-300 hover:text-[#C9A97C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]"
                >
                  {showDetails ? "Nascondi preferenze" : "Personalizza"}
                </button>

                <AnimatePresence initial={false}>
                  {showDetails && (
                    <motion.div
                      id="sda-cookie-preferences"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 space-y-4 border-t border-[#B89768]/20 pt-5">
                        <ConsentToggle
                          id="sda-cookie-necessary"
                          title="Cookie Tecnici / Necessari"
                          description="Indispensabili per il funzionamento e la sicurezza del sito. Sempre attivi."
                          checked
                          disabled
                          onChange={() => undefined}
                        />
                        <ConsentToggle
                          id="sda-cookie-analytics"
                          title="Cookie Analitici"
                          description="Ci aiutano a capire come viene utilizzato il sito e a migliorarne i contenuti."
                          checked={analytics}
                          onChange={setAnalyticsOverride}
                        />
                        <ConsentToggle
                          id="sda-cookie-marketing"
                          title="Cookie Marketing / Profilazione"
                          description="Utilizzati per mostrarti contenuti e annunci in linea con i tuoi interessi."
                          checked={marketing}
                          onChange={setMarketingOverride}
                        />

                        <button
                          type="button"
                          onClick={savePreferences}
                          className="w-full cursor-pointer border border-[#B89768] bg-[#B89768] px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#1A140E] transition-colors duration-300 hover:bg-[#C9A97C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E]"
                        >
                          Salva preferenze
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {storedConsent && !isOpen && (
          <motion.button
            key="sda-cookie-badge"
            type="button"
            onClick={reopenPreferences}
            aria-label="Riapri le preferenze cookie"
            title="Preferenze cookie"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 left-5 z-[9989] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#B89768]/40 bg-[#1A140E]/90 text-[#B89768] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-300 hover:bg-[#B89768] hover:text-[#1A140E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E]"
          >
            <ShieldIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
