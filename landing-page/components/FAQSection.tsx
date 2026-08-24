"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "I fornitori devono essere necessariamente quelli scelti da te oppure possiamo proporne anche di nostri?",
    paragraphs: [
      "Non necessariamente, ma la scelta dei fornitori è una parte fondamentale del progetto.",
      "Io paragono sempre l’organizzazione di un matrimonio importante a un grande progetto di architettura: anche il miglior progetto, per essere realizzato esattamente come è stato pensato, ha bisogno di un’impresa e di professionisti all’altezza.",
      "Lo stesso accade in un matrimonio. Un progetto di livello richiede fornitori con esperienza, affidabilità e soprattutto abituati a lavorare in eventi complessi e di una determinata qualità. Per questo motivo preferisco affidarmi a professionisti che conosco, che ho già selezionato nel tempo e dei quali conosco perfettamente metodo di lavoro e standard qualitativi.",
      "Questo non significa assolutamente escludere eventuali fornitori proposti dagli sposi. Possiamo certamente valutarli insieme. È però importante che siano professionisti specializzati nei grandi eventi e che possano garantire il livello necessario per realizzare correttamente il progetto.",
      "In fondo, il mio compito non è semplicemente scegliere dei fornitori, ma costruire una squadra capace di trasformare il progetto in realtà."
    ]
  },
  {
    question: "Organizzare il matrimonio con una wedding planner costa di più rispetto a fare tutto da soli?",
    paragraphs: [
      "Dipende da cosa si vuole ottenere.",
      "Una wedding planner professionista guarda il matrimonio con un occhio diverso. Non considera i singoli elementi separatamente, ma costruisce un progetto complessivo, nel quale fiori, luci, arredi, mise en place, grafica e ogni altro dettaglio devono dialogare tra loro ed essere perfettamente coerenti.",
      "Questo porta inevitabilmente a una maggiore personalizzazione. Spesso non ci si limita semplicemente a ciò che la location mette già a disposizione, ma si interviene per trasformare gli spazi, valorizzarli e renderli davvero rappresentativi degli sposi. E naturalmente, più un progetto è personalizzato e ricco di dettagli, più può aumentare il suo valore economico.",
      "Ma questo non significa che avere una wedding planner voglia dire necessariamente spendere di più.",
      "Anzi, uno degli aspetti più importanti del mio lavoro è proprio gestire e distribuire correttamente il budget: capire dove vale la pena investire, dove invece si può contenere la spesa, quali elementi hanno realmente un impatto sul risultato finale e quali, al contrario, rischiano di assorbire denaro senza aggiungere valore al progetto.",
      "A parità di budget, un matrimonio progettato e seguito da una professionista permette di utilizzare molto meglio le risorse disponibili, evitando anche scelte sbagliate, spese inutili o elementi che, presi singolarmente, possono essere bellissimi ma che insieme non funzionano.",
      "Non amo dire che con una wedding planner si spende di più: preferisco dire che si progetta di più e, soprattutto, si spende meglio."
    ]
  },
  {
    question: "Organizzi anche matrimoni fuori dalla Campania o all’estero?",
    paragraphs: [
      "Certamente. Ci muoviamo in tutta Italia, comprese le isole, e siamo disponibili anche per matrimoni all’estero.",
      "Una parte importante del nostro lavoro riguarda proprio i destination wedding, soprattutto coppie che scelgono di venire a sposarsi in Italia e, in particolare, nel Sud: Costiera Amalfitana, Costiera Sorrentina, Capri, Ischia e altre destinazioni italiane.",
      "Allo stesso modo, possiamo seguire anche coppie che desiderano organizzare il proprio matrimonio fuori dall’Italia. In questi casi studiamo il progetto insieme alla coppia, valutando location, logistica, fornitori e tutti gli aspetti necessari per mantenere lo stesso livello di cura e personalizzazione, indipendentemente dalla destinazione.",
      "Il nostro lavoro non è legato a un luogo preciso: partiamo sempre dal progetto e dagli sposi, e costruiamo intorno a loro il matrimonio, ovunque abbiano scelto di celebrarlo."
    ]
  },
  {
    question: "Nella cifra prevista per gli allestimenti è compresa anche la parcella professionale della wedding planner?",
    paragraphs: [
      "Assolutamente no. La parcella professionale e il budget destinato agli allestimenti sono due voci completamente distinte.",
      "Mi piace fare un paragone con il mondo dell’architettura: quando si realizza un progetto, da una parte c’è la parcella dell’architetto, che comprende la progettazione, la consulenza e il coordinamento del lavoro; dall’altra ci sono i costi dell’impresa e di tutto ciò che serve materialmente per realizzarlo. Nel matrimonio funziona esattamente allo stesso modo.",
      "La parcella della Wedding Planner – o, nel mio caso, della Wedding Architect – riguarda il lavoro professionale: la progettazione dell’evento, la consulenza, la ricerca e il coordinamento dei fornitori, la supervisione e la gestione di tutto il matrimonio.",
      "Separatamente viene poi definito il budget necessario per realizzare concretamente il progetto: fiori, luci, arredi, strutture, elementi decorativi, grafica e tutto ciò che verrà scelto per l’allestimento. E questo secondo importo non può essere uguale per tutti, perché ogni matrimonio nasce da un progetto diverso, costruito sulle esigenze, sui desideri e sul budget della singola coppia.",
      "La mia parcella remunera il progetto e il lavoro professionale; il budget degli allestimenti serve invece a trasformare quel progetto in realtà."
    ]
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
                  className="w-full flex justify-between items-center text-left py-2 gap-4 group focus:outline-none cursor-pointer"
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
                      <div className="pt-4 space-y-3 text-base md:text-lg font-sans font-light leading-relaxed text-[#4A3B32]/85 max-w-3xl">
                        {faq.paragraphs.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
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
