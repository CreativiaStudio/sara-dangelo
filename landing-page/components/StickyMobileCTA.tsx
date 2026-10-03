"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const CONSENT_STORAGE_KEY = "sda_cookie_consent";
const CONSENT_UPDATED_EVENT = "sda_consent_updated";

const WHATSAPP_HREF =
  "https://wa.me/393386245838?text=Ciao%20Sara!%20Ho%20visto%20i%20tuoi%20matrimoni%20su%20Instagram%20✨%20Vorrei%20raccontarti%20come%20immaginiamo%20il%20nostro%20giorno...%20";

/**
 * True while the cookie banner is (or should be) visible: the banner is shown
 * until the visitor stores a valid consent decision. The same key/event used by
 * CookieConsentBanner are read here so the two surfaces never overlap.
 */
function isCookieBannerOpen(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return !window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return false;
  }
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function StickyMobileCTA() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [funnelInView, setFunnelInView] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);

  // Sync with the cookie consent banner: it is open while no decision is stored.
  useEffect(() => {
    const sync = () => setBannerOpen(isCookieBannerOpen());
    sync();
    window.addEventListener(CONSENT_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Reveal only once the visitor has scrolled past the hero.
  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide when the funnel/contact form is already visible on screen.
  const visibleTargets = useRef<Set<string>>(new Set());
  useEffect(() => {
    const targets = ["funnel", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            visibleTargets.current.add(id);
          } else {
            visibleTargets.current.delete(id);
          }
        }
        setFunnelInView(visibleTargets.current.size > 0);
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleScrollToContact = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target =
        document.getElementById("contact") ?? document.getElementById("funnel");
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", "#contact");
    },
    [shouldReduceMotion]
  );

  const handleWhatsAppClick = useCallback(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", "WhatsAppClick", { source: "sticky_mobile" });
    }
  }, []);

  const isVisible = scrolledPastHero && !funnelInView && !bannerOpen;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sda-sticky-mobile-cta"
          initial={{ y: shouldReduceMotion ? 0 : "110%", opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: shouldReduceMotion ? 0 : "110%", opacity: shouldReduceMotion ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[9980] md:hidden bg-[#1A140E]/95 backdrop-blur-md border-t border-[#B89768]/30 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] text-[#FDFBF7] pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] pt-2.5 px-4"
        >
          <div className="flex items-center gap-3 max-w-lg mx-auto w-full">
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#B89768] px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#1A140E] shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-500 hover:bg-[#C9A97C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E]"
            >
              <span>Raccontami il tuo sogno</span>
              <ArrowIcon />
            </a>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              aria-label="Scrivi alla Wedding Concierge su WhatsApp"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#B89768]/50 bg-[#1A140E] text-[#B89768] transition-colors duration-300 hover:border-[#B89768] hover:bg-[#B89768]/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A140E]"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
