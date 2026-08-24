"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FAQItem {
  number: string;
  question: string;
  lead: string;
  paragraphs: string[];
  quote: string;
}

const faqs: FAQItem[] = [
  {
    number: "01",
    question: "I fornitori devono essere necessariamente quelli scelti da te oppure possiamo proporne anche di nostri?",
    lead: "Non necessariamente, ma la scelta dei fornitori è una parte fondamentale del progetto.",
    paragraphs: [
      "Io paragono sempre l’organizzazione di un matrimonio importante a un grande progetto di architettura: anche il miglior progetto, per essere realizzato esattamente come è stato pensato, ha bisogno di un’impresa e di professionisti all’altezza.",
      "Lo stesso accade in un matrimonio. Un progetto di livello richiede fornitori con esperienza, affidabilità e soprattutto abituati a lavorare in eventi complessi e di una determinata qualità. Per questo motivo preferisco affidarmi a professionisti che conosco, che ho già selezionato nel tempo e dei quali conosco perfettamente metodo di lavoro e standard qualitativi.",
      "Questo non significa assolutamente escludere eventuali fornitori proposti dagli sposi. Possiamo certamente valutarli insieme. È però importante che siano professionisti specializzati nei grandi eventi e che possano garantire il livello necessario per realizzare correttamente il progetto."
    ],
    quote: "In fondo, il mio compito non è semplicemente scegliere dei fornitori, ma costruire una squadra capace di trasformare il progetto in realtà."
  },
  {
    number: "02",
    question: "Organizzare il matrimonio con una wedding planner costa di più rispetto a fare tutto da soli?",
    lead: "Dipende da cosa si vuole ottenere.",
    paragraphs: [
      "Una wedding planner professionista guarda il matrimonio con un occhio diverso. Non considera i singoli elementi separatamente, ma costruisce un progetto complessivo, nel quale fiori, luci, arredi, mise en place, grafica e ogni altro dettaglio devono dialogare tra loro ed essere perfettamente coerenti.",
      "Questo porta inevitabilmente a una maggiore personalizzazione. Spesso non ci si limita semplicemente a ciò che la location mette già a disposizione, ma si interviene per trasformare gli spazi, valorizzarli e renderli davvero rappresentativi degli sposi. E naturalmente, più un progetto è personalizzato e ricco di dettagli, più può aumentare il suo valore economico.",
      "Ma questo non significa che avere una wedding planner voglia dire necessariamente spendere di più.",
      "Anzi, uno degli aspetti più importanti del mio lavoro è proprio gestire e distribuire correttamente il budget: capire dove vale la pena investire, dove invece si può contenere la spesa, quali elementi hanno realmente un impatto sul risultato finale e quali, al contrario, rischiano di assorbire denaro senza aggiungere valore al progetto.",
      "A parità di budget, un matrimonio progettato e seguito da una professionista permette di utilizzare molto meglio le risorse disponibili, evitando anche scelte sbagliate, spese inutili o elementi che, presi singolarmente, possono essere bellissimi ma che insieme non funzionano."
    ],
    quote: "Non amo dire che con una wedding planner si spende di più: preferisco dire che si progetta di più e, soprattutto, si spende meglio."
  },
  {
    number: "03",
    question: "Organizzi anche matrimoni fuori dalla Campania o all’estero?",
    lead: "Certamente. Ci muoviamo in tutta Italia, comprese le isole, e siamo disponibili anche per matrimoni all’estero.",
    paragraphs: [
      "Una parte importante del nostro lavoro riguarda proprio i destination wedding, soprattutto coppie che scelgono di venire a sposarsi in Italia e, in particolare, nel Sud: Costiera Amalfitana, Costiera Sorrentina, Capri, Ischia e altre destinazioni italiane.",
      "Allo stesso modo, possiamo seguire anche coppie che desiderano organizzare il proprio matrimonio fuori dall’Italia. In questi casi studiamo il progetto insieme alla coppia, valutando location, logistica, fornitori e tutti gli aspetti necessari per mantenere lo stesso livello di cura e personalizzazione, indipendentemente dalla destinazione."
    ],
    quote: "Il nostro lavoro non è legato a un luogo preciso: partiamo sempre dal progetto e dagli sposi, e costruiamo intorno a loro il matrimonio, ovunque abbiano scelto di celebrarlo."
  },
  {
    number: "04",
    question: "Nella cifra prevista per gli allestimenti è compresa anche la parcella professionale della wedding planner?",
    lead: "Assolutamente no. La parcella professionale e il budget destinato agli allestimenti sono due voci completamente distinte.",
    paragraphs: [
      "Mi piace fare un paragone con il mondo dell’architettura: quando si realizza un progetto, da una parte c’è la parcella dell’architetto, che comprende la progettazione, la consulenza e il coordinamento del lavoro; dall’altra ci sono i costi dell’impresa e di tutto ciò che serve materialmente per realizzarlo. Nel matrimonio funziona esattamente allo stesso modo.",
      "La parcella della Wedding Planner – o, nel mio caso, della Wedding Architect – riguarda il lavoro professionale: la progettazione dell’evento, la consulenza, la ricerca e il coordinamento dei fornitori, la supervisione e la gestione di tutto il matrimonio.",
      "Separatamente viene poi definito il budget necessario per realizzare concretamente il progetto: fiori, luci, arredi, strutture, elementi decorativi, grafica e tutto ciò che verrà scelto per l’allestimento. E questo secondo importo non può essere uguale per tutti, perché ogni matrimonio nasce da un progetto diverso, costruito sulle esigenze, sui desideri e sul budget della singola coppia."
    ],
    quote: "La mia parcella remunera il progetto e il lavoro professionale; il budget degli allestimenti serve invece a trasformare quel progetto in realtà."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = faqs.length;
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
          <span className="label-caps mb-4 block text-[#B89768]">Chiarezza & Trasparenza</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            Domande <span className="italic font-light text-[#B89768]">Frequenti</span>
          </h2>
          <div className="w-12 h-px bg-[#B89768]/40 mx-auto mt-5" />
        </motion.div>

        {/* Editorial FAQ Cards */}
        <div className="space-y-6 md:space-y-7">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.number}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: shouldReduceMotion ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`transition-all duration-500 border ${
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
