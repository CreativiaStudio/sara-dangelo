"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Come vengono gestiti i fiori e gli allestimenti scenografici?",
    answer:
      "Non mi limito a scegliere i fiori: ne studio la disposizione in relazione all'architettura della location, alla luce naturale e al design dei tavoli. Lavoro a stretto contatto con i migliori flower designer per trasformare gli spazi in vere e proprie installazioni d'autore."
  },
  {
    question: "Realizzi matrimoni anche fuori dalla Campania o all'estero?",
    answer:
      "Assolutamente sì. Oltre a Napoli, la Costiera Amalfitana e Capri, firmo progetti in tutta Italia (Puglia, Roma, Lago di Como) e Destination Weddings per coppie internazionali, garantendo la medesima regia e presenza costante in cantiere."
  },
  {
    question: "Quali sono i costi e come viene definita la parcella?",
    answer:
      "Ogni progetto è unico e su misura. La parcella viene definita in modo trasparente subito dopo la consulenza conoscitiva di 30 minuti e lo studio preliminare del progetto, senza costi nascosti o sorprese in itinere."
  },
  {
    question: "Che differenza c'è tra Wedding Planner e Wedding Architect?",
    answer:
      "La Wedding Planner gestisce la logistica. Come Wedding Architect unisco la regia organizzativa alla progettazione degli spazi: studio planimetrie, luci, ingegneria dei flussi ed estetica per dar vita a un matrimonio con fondamenta solide e una resa scenografica impeccabile."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-36 bg-[#FDFBF7] text-[#4A3B32] border-t border-[#4A3B32]/10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="label-caps mb-4 block text-[#B89768]">Chiarezza & Trasparenza</span>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight">
            Domande <span className="italic font-light text-[#B89768]">Frequenti</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="border-b border-[#4A3B32]/15 pb-6"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex justify-between items-center text-left py-2 gap-4 group focus:outline-none"
                >
                  <span className="font-serif italic text-xl md:text-2xl text-[#4A3B32] group-hover:text-[#B89768] transition-colors duration-300">
                    {faq.question}
                  </span>
                  <span className="text-2xl font-light text-[#B89768] shrink-0 transition-transform duration-300">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-base md:text-lg font-sans font-light leading-relaxed text-[#4A3B32]/80 max-w-3xl">
                        {faq.answer}
                      </p>
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
