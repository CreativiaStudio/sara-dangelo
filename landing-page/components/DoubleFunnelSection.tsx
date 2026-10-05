"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { FbqFunction } from "@/components/MetaPixel";

const WHATSAPP_HREF =
  "https://wa.me/393386245838?text=Ciao%20Sara!%20Ho%20visto%20i%20tuoi%20matrimoni%20su%20Instagram%20✨%20Vorrei%20raccontarti%20come%20immaginiamo%20il%20nostro%20giorno...%20";

function createEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const inputClass =
  "w-full bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`py-2 px-3.5 text-xs font-sans rounded-sm transition-all border ${
        selected
          ? "border-[#B89768] bg-[#B89768] text-white font-semibold shadow-sm"
          : "border-[#B89768]/40 bg-[#FDFBF7] text-[#4A3B32] hover:border-[#B89768] hover:bg-[#F5EFE6]"
      }`}
    >
      {label}
    </button>
  );
}

interface QuestionGroupProps {
  label: string;
  help?: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

function QuestionGroup({ label, help, options, value, onSelect }: QuestionGroupProps) {
  return (
    <div>
      <p className="font-sans text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#4A3B32]">
        {label}
      </p>
      {help && (
        <p className="mt-1 text-xs text-[#4A3B32]/70 italic font-sans">{help}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={value === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </div>
  );
}

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function DoubleFunnelSection() {
  const { t, isEn } = useLanguage();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — touch chip selections
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedGuests, setSelectedGuests] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  // Step 2 — contact details
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showCustomMessage, setShowCustomMessage] = useState(false);

  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step1Error, setStep1Error] = useState(false);

  const handleContinue = () => {
    if (selectedYear && selectedLocation && selectedGuests && selectedBudget) {
      setStep1Error(false);
      setStep(2);
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("trackCustom", "FormStep1");
      }
    } else {
      setStep1Error(true);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactStatus === "loading") return;
    if (
      !contactName.trim() ||
      !contactEmail.trim() ||
      !contactEmail.includes("@") ||
      !contactPhone.trim() ||
      !privacyAccepted
    ) {
      setContactStatus("error");
      return;
    }

    setContactStatus("loading");

    try {
      const eventId = createEventId();
      const fbp = readCookie("_fbp");
      const fbc = readCookie("_fbc");
      const eventSourceUrl = typeof window !== "undefined" ? window.location.href : undefined;

      const res = await fetch("/api/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          date: selectedYear,
          location: selectedLocation,
          guests: selectedGuests,
          budget: selectedBudget,
          message: contactMessage,
          privacyAccepted,
          eventId,
          fbp,
          fbc,
          eventSourceUrl,
          type: "consultation_free",
        }),
      });

      if (res.ok) {
        // Browser-side Lead event, fired ONLY once the server has confirmed the
        // lead, with the same event_id used server-side for perfect
        // deduplication between Pixel and Conversions API.
        const fbq: FbqFunction | undefined =
          typeof window !== "undefined" ? window.fbq : undefined;
        if (fbq) {
          fbq(
            "track",
            "Lead",
            {
              content_name: "Richiesta Progetto Wedding Architect",
              currency: "EUR",
              value: 0,
            },
            { eventID: eventId }
          );
        }

        setContactStatus("success");
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
  };

  return (
    <div id="contact">
      <section id="funnel" data-theme="dark" className="w-full relative overflow-hidden bg-[#2A2118]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/bellevue-setup.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            quality={60}
          />
          <div className="absolute inset-0 bg-[#2A2118]/85" />
        </div>

        <div className="relative z-10 max-w-[90rem] mx-auto px-4 lg:px-16 py-28 md:py-40">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="font-sans text-xs tracking-[0.35em] uppercase text-[#B89768] mb-4 block">
              {t.funnel.badge}
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tight text-[#FDFBF7]">
              {t.funnel.titleLine1} <span className="italic font-light text-[#B89768]">{t.funnel.titleLine2}</span>
            </h2>
          </motion.div>

          {/* Form Card */}
          <div className="flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl bg-[#FDFBF7] p-6 sm:p-8 md:p-14 shadow-2xl border border-[#B89768]/40"
              data-theme="light"
            >
              <div className="w-full mx-auto">
                <div className="text-center mb-8 md:mb-10">
                  <span className="label-caps mb-3 block mx-auto text-[#B89768]">{t.funnel.cardBadge}</span>
                  <h3 className="text-2xl md:text-4xl font-serif text-[#4A3B32] mb-4">
                    {t.funnel.cardTitle}
                  </h3>
                  <div className="editorial-line mx-auto mb-6" />

                  {/* Soft & Warm Selection Note */}
                  <div className="bg-[#F5EFE6] border border-[#B89768]/30 p-5 md:p-7 mb-8 text-left rounded-sm">
                    <p className="text-xs md:text-sm font-sans font-light leading-relaxed text-[#4A3B32]/90 italic whitespace-pre-line">
                      <strong className="font-semibold text-[#4A3B32] not-italic block mb-1">{t.funnel.exclusivityNoteTitle}</strong>
                      {t.funnel.exclusivityNote}
                    </p>
                  </div>
                </div>

                {contactStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#F5EFE6] text-[#4A3B32] p-8 text-center border border-[#B89768]/40 max-w-xl mx-auto my-6"
                  >
                    <p className="font-serif italic text-2xl text-[#B89768] mb-4">
                      {t.funnel.success.titlePrefix} {contactName}!
                    </p>
                    <p className="font-sans text-sm font-light text-[#4A3B32]/80 leading-relaxed whitespace-pre-line">
                      {t.funnel.success.message}
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {/* Step indicator */}
                        <div className="flex justify-center mb-6">
                          <span className="inline-flex items-center rounded-full border border-[#B89768]/40 bg-[#F5EFE6] px-4 py-1 font-sans text-[10px] uppercase tracking-[0.25em] text-[#B89768]">
                            {t.funnel.step1.stepIndicator}
                          </span>
                        </div>

                        <div className="text-center mb-7">
                          <h4 className="font-serif text-2xl md:text-3xl text-[#4A3B32]">
                            {t.funnel.step1.title}
                          </h4>
                          <p className="mt-1 font-sans text-xs text-[#4A3B32]/70">
                            {t.funnel.step1.subtitle}
                          </p>
                        </div>

                        <div className="flex flex-col gap-7">
                          <QuestionGroup
                            label={t.funnel.step1.yearLabel}
                            options={t.funnel.step1.yearOptions}
                            value={selectedYear}
                            onSelect={setSelectedYear}
                          />
                          <QuestionGroup
                            label={t.funnel.step1.locationLabel}
                            options={t.funnel.step1.locationOptions}
                            value={selectedLocation}
                            onSelect={setSelectedLocation}
                          />
                          <QuestionGroup
                            label={t.funnel.step1.guestsLabel}
                            options={t.funnel.step1.guestsOptions}
                            value={selectedGuests}
                            onSelect={setSelectedGuests}
                          />
                          <QuestionGroup
                            label={t.funnel.step1.budgetLabel}
                            help={t.funnel.step1.budgetHelp}
                            options={t.funnel.step1.budgetOptions}
                            value={selectedBudget}
                            onSelect={setSelectedBudget}
                          />
                        </div>

                        {step1Error && (
                          <p className="mt-6 text-center text-xs text-red-700" role="alert">
                            {isEn
                              ? "Please select all four preferences to continue."
                              : "Selezionate tutte e quattro le preferenze per continuare."}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleContinue}
                          className="mt-7 w-full bg-[#B89768] text-[#FDFBF7] font-sans uppercase tracking-[0.25em] text-xs font-semibold py-5 hover:bg-[#4A3B32] hover:text-[#FDFBF7] transition-all duration-500 shadow-md"
                        >
                          {t.funnel.step1.continueButton}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {/* Step header: back + indicator */}
                        <div className="flex items-center justify-between gap-3 mb-6">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="font-sans text-xs text-[#B89768] hover:text-[#4A3B32] underline underline-offset-4 transition-colors"
                          >
                            {t.funnel.step2.backButton}
                          </button>
                          <span className="inline-flex items-center rounded-full border border-[#B89768]/40 bg-[#F5EFE6] px-4 py-1 font-sans text-[10px] uppercase tracking-[0.25em] text-[#B89768]">
                            {t.funnel.step2.stepIndicator}
                          </span>
                        </div>

                        <div className="text-center mb-7">
                          <h4 className="font-serif text-2xl md:text-3xl text-[#4A3B32]">
                            {t.funnel.step2.title}
                          </h4>
                          <p className="mt-1 font-sans text-xs text-[#4A3B32]/70">
                            {t.funnel.step2.subtitle}
                          </p>
                        </div>

                        <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                          <input
                            type="text"
                            placeholder={t.funnel.step2.namePlaceholder}
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required
                            className={inputClass}
                          />

                          <input
                            type="tel"
                            inputMode="tel"
                            placeholder={t.funnel.step2.phonePlaceholder}
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            required
                            className={inputClass}
                          />

                          <input
                            type="email"
                            inputMode="email"
                            placeholder={t.funnel.step2.emailPlaceholder}
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            required
                            className={inputClass}
                          />

                          {/* Optional detail toggle + textarea */}
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => setShowCustomMessage((value) => !value)}
                              aria-expanded={showCustomMessage}
                              className="self-start text-left font-sans text-xs text-[#B89768] hover:text-[#4A3B32] underline underline-offset-4 transition-colors"
                            >
                              {t.funnel.step2.toggleMessage}
                            </button>

                            <AnimatePresence initial={false}>
                              {showCustomMessage && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <textarea
                                    placeholder={t.funnel.step2.messagePlaceholder}
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    rows={3}
                                    className={`${inputClass} mt-3 resize-none`}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Privacy Policy Checkbox */}
                          <div className="flex items-start gap-3 mt-1">
                            <input
                              type="checkbox"
                              id="privacy"
                              checked={privacyAccepted}
                              onChange={(e) => setPrivacyAccepted(e.target.checked)}
                              required
                              className="mt-1 h-4 w-4 rounded border-[#4A3B32]/30 text-[#B89768] focus:ring-[#B89768] accent-[#B89768] cursor-pointer"
                            />
                            <label htmlFor="privacy" className="text-xs font-sans font-light text-[#4A3B32]/80 leading-relaxed cursor-pointer select-none">
                              {t.funnel.step2.privacyPrefix} <span className="underline font-normal text-[#4A3B32]">{t.funnel.step2.privacyLink}</span> {t.funnel.step2.privacySuffix}
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={contactStatus === "loading"}
                            className="mt-3 w-full bg-[#B89768] text-[#FDFBF7] font-sans uppercase tracking-[0.25em] text-xs font-semibold py-5 hover:bg-[#4A3B32] hover:text-[#FDFBF7] disabled:opacity-50 transition-all duration-500 shadow-md"
                          >
                            {contactStatus === "loading"
                              ? t.funnel.step2.submittingButton
                              : t.funnel.step2.submitButton}
                          </button>

                          {contactStatus === "error" && (
                            <p className="text-red-700 text-xs text-center" role="alert">
                              {t.funnel.step2.errorGeneral}
                            </p>
                          )}

                          <p className="text-center font-sans text-xs font-light leading-relaxed text-[#4A3B32]/60">
                            {t.funnel.step2.submitNote}
                          </p>

                          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
                            <span className="font-sans text-xs text-[#4A3B32]/70">
                              {t.funnel.step2.whatsappAltPrefix}
                            </span>
                            <a
                              href={WHATSAPP_HREF}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-xs text-[#B89768] hover:text-[#4A3B32] underline underline-offset-4 transition-colors"
                            >
                              {t.funnel.step2.whatsappAltLink}
                            </a>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-[#B89768]/15 py-10">
          <div className="max-w-[90rem] mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-lg text-[#FDFBF7]/80 tracking-wide">
              {t.footer.brand}
            </p>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/50">
              {t.footer.tagline}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
