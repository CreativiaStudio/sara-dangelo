"use client";

import { useId } from "react";
import { motion } from "framer-motion";

import { useLanguage, type Language } from "@/lib/i18n/LanguageContext";

/**
 * Variante di rendering del selettore:
 * - "desktop": pill compatta, pensata per la Navbar.
 * - "mobile": variante estesa, pensata per il menu mobile.
 */
export type LanguageSwitcherVariant = "desktop" | "mobile";

export interface LanguageSwitcherProps {
  /** Layout da usare. Default: "desktop". */
  variant?: LanguageSwitcherVariant;
  /** Classi aggiuntive opzionali applicate al wrapper. */
  className?: string;
}

interface LanguageOption {
  code: Language;
  /** Nome per screen reader / tooltip. */
  label: string;
  /** Sigla mostrata accanto alla bandierina. */
  shortLabel: string;
}

const OPTIONS: readonly LanguageOption[] = [
  { code: "it", label: "Italiano", shortLabel: "IT" },
  { code: "en", label: "English", shortLabel: "EN" },
];

/* ─── Bandierine (SVG nitide, nessuna dipendenza da emoji) ─── */

function ItalyFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 3 2"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="1" height="2" fill="#009246" />
      <rect x="1" y="0" width="1" height="2" fill="#FDFBF7" />
      <rect x="2" y="0" width="1" height="2" fill="#CE2B37" />
    </svg>
  );
}

function UnitedKingdomFlag({ className }: { className?: string }) {
  // id univoco: evita collisioni quando più istanze sono montate insieme.
  const clipId = `uk-flag-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={clipId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect x="0" y="0" width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FDFBF7" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clipId})`}
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FDFBF7" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function Flag({ code, className }: { code: Language; className?: string }) {
  return code === "it" ? (
    <ItalyFlag className={className} />
  ) : (
    <UnitedKingdomFlag className={className} />
  );
}

/* ─── Selettore ─── */

export default function LanguageSwitcher({
  variant = "desktop",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const pillLayoutId = `lang-pill-${useId().replace(/:/g, "")}`;
  const isMobile = variant === "mobile";

  return (
    <div
      role="group"
      aria-label={t.nav.langLabel}
      className={[
        "relative inline-flex items-center rounded-full",
        "border border-[#B89768]/35 bg-[#FDFBF7]/90 backdrop-blur-md",
        "shadow-[0_2px_14px_rgba(74,59,50,0.10)]",
        isMobile ? "w-full max-w-[260px] justify-center p-1" : "p-0.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {OPTIONS.map((option) => {
        const isActive = language === option.code;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-pressed={isActive}
            aria-label={option.label}
            title={option.label}
            className={[
              "relative isolate inline-flex items-center justify-center gap-2 rounded-full",
              "font-sans font-medium uppercase transition-colors duration-500",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]",
              "focus-visible:ring-offset-1 focus-visible:ring-offset-[#FDFBF7]",
              isMobile
                ? "flex-1 px-4 py-2 text-[11px] tracking-[0.25em]"
                : "px-3 py-1.5 text-[10px] tracking-[0.2em]",
              isActive ? "text-[#FDFBF7]" : "text-[#4A3B32]/55 hover:text-[#4A3B32]",
            ].join(" ")}
          >
            {isActive && (
              <motion.span
                layoutId={pillLayoutId}
                className="absolute inset-0 z-0 rounded-full bg-gradient-to-b from-[#C8A97C] to-[#B89768] shadow-[0_2px_10px_rgba(184,151,104,0.45)] pointer-events-none"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}

            <span
              className={[
                "relative z-10 shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10",
                isMobile ? "h-[14px] w-[21px]" : "h-[12px] w-[18px]",
                isActive ? "ring-white/30" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Flag code={option.code} className="h-full w-full" />
            </span>

            <span className="relative z-10 leading-none">
              {option.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
