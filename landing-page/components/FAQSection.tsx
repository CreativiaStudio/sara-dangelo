"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FAQSection() {
  const { t } = useLanguage();
  const faqItems = t.faq.items;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);

    if (isOpening) {
      // Step 1: Immediate scroll call on user interaction
      requestAnimationFrame(() => {
        const el = document.getElementById(`faq-card-${index}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      // Step 2: Dynamic repositioning as accordion animation proceeds to guarantee precise top alignment
      setTimeout(() => {
        const el = document.getElementById(`faq-card-${index}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = faqItems.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % count;
      document.getElementById(`faq-question-${nextIndex}`)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + count) % count;
      document.getElementById(`faq-question-${prevIndex}`)?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      document.getElementById(`faq-question-0`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      document.getElementById(`faq-question-${count - 1}`)?.focus();
    }
  };

  return (
    <section
      id="faq"
      className="py-24 md:py-36 lg:py-44 bg-[#FDFBF7] text-[#4A3B32] border-t border-[#4A3B32]/10 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="label-caps mb-4 block text-[#B89768]">{t.faq.badge}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            {t.faq.titleLine1} <span className="italic font-light text-[#B89768]">{t.faq.titleLine2}</span>
          </h2>
          <div className="w-12 h-px bg-[#B89768]/40 mx-auto mt-5" />
        </motion.div>

        {/* Editorial FAQ Cards */}
        <div className="space-y-6 md:space-y-7">
          {faqItems.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.number}
                id={`faq-card-${idx}`}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: shouldReduceMotion ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32 transition-all duration-500 border ${
                  isOpen
                    ? "bg-[#FAF7F2] border-[#B89768]/45 shadow-[0_12px_36px_rgba(74,59,50,0.06)] ring-1 ring-[#B89768]/15"
                    : "bg-[#FAF7F2]/70 hover:bg-[#FAF7F2] border-[#B89768]/20 hover:border-[#B89768]/40 shadow-[0_4px_16px_rgba(74,59,50,0.02)] hover:shadow-[0_8px_24px_rgba(74,59,50,0.05)]"
                }`}
              >
                {/* Accordion Header (WAI-ARIA APG: Heading wraps Button) */}
                <h3 className="m-0 p-0 font-normal">
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                    className="w-full flex items-center justify-between text-left p-5 sm:p-7 md:p-8 gap-3.5 sm:gap-5 md:gap-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] focus-visible:ring-offset-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-5 md:gap-6 flex-1 min-w-0">
                      {/* Number Badge */}
                      <span className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#B89768] shrink-0 select-none transition-transform duration-300 group-hover:scale-105 leading-none">
                        {faq.number}
                      </span>

                      {/* Vertical Hairline Divider */}
                      <div aria-hidden="true" className="w-px h-7 sm:h-9 bg-[#B89768]/25 shrink-0" />

                      {/* Question Title */}
                      <span
                        className={`font-serif text-lg sm:text-xl md:text-2xl transition-colors duration-300 leading-snug break-words ${
                          isOpen ? "text-[#B89768]" : "text-[#4A3B32] group-hover:text-[#B89768]"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    {/* Toggle Icon Badge */}
                    <div
                      aria-hidden="true"
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-500 flex items-center justify-center shrink-0 ${
                        isOpen
                          ? "border-[#B89768] bg-[#B89768] text-[#FDFBF7]"
                          : "border-[#B89768]/30 bg-transparent text-[#B89768] group-hover:border-[#B89768] group-hover:bg-[#B89768]/10"
                      }`}
                    >
                      <svg
                        aria-hidden="true"
                        className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-500 ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </button>
                </h3>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.45,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-8 sm:pb-9 md:px-9 md:pb-10 pt-2 border-t border-[#B89768]/15">
                        
                        {/* Direct Lead Answer */}
                        <div className="my-5 p-5 sm:p-6 bg-[#FDFBF7] border-l-2 border-[#B89768] shadow-sm">
                          <p className="font-serif italic text-lg sm:text-xl md:text-[1.25rem] text-[#4A3B32] leading-snug break-words">
                            {faq.lead}
                          </p>
                        </div>

                        {/* Generously Spaced Explanatory Paragraphs */}
                        <div className="space-y-4 sm:space-y-5 text-base sm:text-[1.05rem] font-sans font-light leading-[1.8] text-[#4A3B32]/85 break-words">
                          {faq.paragraphs.map((paragraph, pIdx) => (
                            <p key={pIdx}>{paragraph}</p>
                          ))}
                        </div>

                        {/* Concluding Architectural Pull-Quote Box */}
                        {faq.quote && (
                          <blockquote className="mt-7 p-5 sm:p-6 md:p-7 bg-[#F5EFE6]/80 border-l-2 border-[#B89768] shadow-sm m-0">
                            <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#4A3B32] leading-relaxed break-words">
                              &ldquo;{faq.quote}&rdquo;
                            </p>
                          </blockquote>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
