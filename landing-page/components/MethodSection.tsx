"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    line1: "Consulenza",
    line2: "Conoscitiva",
    desc: "Ci incontriamo per 30 minuti per conoscerci, ascoltare la vostra visione dell’evento e comprendere i vostri desideri. Vi illustrerò il mio metodo di lavoro e i passaggi successivi attraverso cui svilupperò il progetto.",
    icon: "/media/icons/metodo-01-ascolto.png"
  },
  {
    num: "02",
    line1: "Design degli",
    line2: "Spazi",
    desc: "Disegno concept, planimetrie, scenografie floreali e luci, tutto su misura, ispirandomi all’interior design e valorizzando l’identità della location. Ogni spazio viene studiato per creare armonia e regalarvi un’emozione.",
    icon: "/media/icons/metodo-02-compasso.png"
  },
  {
    num: "03",
    line1: "Pianificazione e",
    line2: "Regia",
    desc: "Definisco la timeline e curo ogni aspetto del coordinamento, della logistica e della regia dell’evento, gestendo fornitori e flussi con precisione.",
    icon: "/media/icons/metodo-03-pianificazione.png"
  },
  {
    num: "04",
    line1: "La Magia del",
    line2: "Giorno",
    desc: "Nel giorno del matrimonio tutto prende forma. Il vostro unico compito sarà vivere la magia di un momento unico e indimenticabile. Al resto penserò io, con una presenza discreta, ma incisiva, affinché tutto sia come lo avete immaginato, e anche oltre.",
    icon: "/media/icons/metodo-04-arco.png"
  }
];

export default function MethodSection() {
  return (
    <section id="metodo" className="py-28 md:py-40 bg-[#35261C] text-[#FDFBF7] relative overflow-hidden">
      
      {/* Architectural Background Image — Clearly Visible & Luminous */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/media/campolieto-palazzo.webp"
          alt="Architettura Villa Campolieto"
          fill
          className="object-cover opacity-60 filter sepia-[0.35] contrast-105 scale-105"
          sizes="100vw"
          quality={90}
        />
        {/* Soft Sepia Warm Brown Mask & Central Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#423226]/85 via-[#35261C]/70 to-[#423226]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,rgba(184,151,104,0.20),transparent_75%)]" />
        <div className="noise-bg opacity-10" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-5xl mx-auto mb-20 md:mb-28"
        >
          <span className="label-caps mb-4 block text-[#D4AF37] tracking-[0.35em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Il Mio Metodo Progettuale</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.4rem] font-serif leading-[1.2] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            <span className="block md:whitespace-nowrap">Come do forma al vostro matrimonio:</span>
            <span className="italic font-light text-[#E5D2B5] block md:whitespace-nowrap">
              il progetto prima della bellezza.
            </span>
          </h2>
        </motion.div>

        {/* 4 Architectural Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-stretch">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden group p-8 lg:p-9 flex flex-col justify-between h-full bg-gradient-to-b from-[#4A3B32]/88 to-[#3A2B20]/92 backdrop-blur-md border border-[#B89768]/35 hover:border-[#D4AF37]/80 shadow-[0_20px_45px_rgba(35,24,16,0.5)] hover:shadow-[0_25px_55px_rgba(184,151,104,0.22)] hover:-translate-y-1.5 transition-all duration-500 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#B89768]/60 before:to-transparent"
            >
              {/* Subtle architectural ambient top glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#B89768]/[0.06] rounded-bl-full pointer-events-none group-hover:bg-[#B89768]/[0.12] transition-colors duration-500" />

              <div>
                {/* Number Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#B89768]/15">
                  <span className="font-serif italic text-3xl md:text-4xl text-[#B89768] block drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    {step.num}
                  </span>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#E5D2B5]/50 font-sans">
                    Fase {step.num}
                  </span>
                </div>

                {/* Architectural Icon */}
                <div className="relative h-24 my-6 flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-[#B89768]/[0.08] blur-md group-hover:bg-[#B89768]/[0.18] transition-colors duration-500 pointer-events-none" />
                  <Image
                    src={step.icon}
                    alt={`${step.line1} ${step.line2}`}
                    width={90}
                    height={90}
                    className="max-h-20 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(219,174,86,0.35)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Fixed 2-line Title */}
                <h3 className="font-serif text-2xl lg:text-[1.65rem] text-[#FDFBF7] mb-3 leading-[1.2] min-h-[3.8rem] flex flex-col justify-end drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  <span>{step.line1}</span>
                  <span className="italic text-[#E5D2B5] font-light">{step.line2}</span>
                </h3>

                {/* Delicate accent hairline */}
                <div className="w-8 h-px bg-[#B89768]/40 mb-4 group-hover:w-16 group-hover:bg-[#B89768] transition-all duration-500" />
              </div>

              {/* Description */}
              <p className="font-sans font-light text-xs md:text-sm leading-relaxed text-[#FDFBF7]/85 min-h-[4.5rem]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
