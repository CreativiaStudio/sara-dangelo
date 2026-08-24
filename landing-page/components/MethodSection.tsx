"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    line1: "Consulenza",
    line2: "Conoscitiva",
    desc: "Ci incontriamo per 30 minuti per conoscerci, ascoltare la vostra visione dell'evento e verificare l'armonia del progetto.",
    image: "/media/campolieto-palazzo.webp"
  },
  {
    num: "02",
    line1: "Design degli",
    line2: "Spazi",
    desc: "Disegno planimetrie, scenografie floreali e luci ispirandomi all'interior design. Ogni angolo viene studiato da me per regalarvi emozione.",
    image: "/media/geometrie.webp"
  },
  {
    num: "03",
    line1: "Regia",
    line2: "Invisibile",
    desc: "Gestisco con rigore i fornitori e la produzione. Nessun imprevisto sul campo: la mia logistica lavora al servizio della vostra bellezza.",
    image: "/media/campolieto-tables.webp"
  },
  {
    num: "04",
    line1: "La Magia del",
    line2: "Giorno",
    desc: "Il vostro unico compito sarà vivere la magia di quel giorno. Al resto penserò io con presenza discreta, affinché tutto sia come lo avete immaginato.",
    image: "/media/bellevue-night.webp"
  }
];

export default function MethodSection() {
  return (
    <section id="metodo" className="py-28 md:py-40 bg-[#1A140E] text-[#FDFBF7] relative overflow-hidden">
      
      {/* Architectural Background Image — Clearly Visible & Luminous */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/media/campolieto-palazzo.webp"
          alt="Architettura Villa Campolieto"
          fill
          className="object-cover opacity-50 filter sepia-[0.3] contrast-110 scale-105"
          sizes="100vw"
          quality={90}
        />
        {/* Soft Sepia Warm Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A2118]/75 via-[#1A140E]/60 to-[#2A2118]/85" />
        <div className="noise-bg opacity-10" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-20 md:mb-28"
        >
          <span className="label-caps mb-4 block text-[#D4AF37] tracking-[0.35em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Il Mio Metodo Progettuale</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Come do forma al vostro matrimonio: <br />
            <span className="italic font-light text-[#E5D2B5]">il progetto prima della bellezza.</span>
          </h2>
        </motion.div>

        {/* 4 Cards Grid with Photo Overlays */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] photo-frame overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-end p-8 border border-[#B89768]/30 backdrop-blur-[2px]"
            >
              {/* Photo Background */}
              <Image
                src={step.image}
                alt={`${step.line1} ${step.line2}`}
                fill
                className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
                quality={85}
              />

              {/* Dark Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A140E]/95 via-[#1A140E]/50 to-transparent transition-opacity duration-500" />

              {/* Card Content */}
              <div className="relative z-10 flex flex-col justify-end">
                <span className="font-serif italic text-4xl md:text-5xl text-[#B89768] block mb-2 opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  {step.num}
                </span>
                
                {/* Fixed 2-line title container for absolute symmetry */}
                <h3 className="font-serif text-2xl md:text-3xl text-[#FDFBF7] mb-3 leading-[1.15] min-h-[3.6rem] flex flex-col justify-end drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  <span>{step.line1}</span>
                  <span>{step.line2}</span>
                </h3>

                {/* Description */}
                <p className="font-sans font-light text-xs md:text-sm leading-relaxed text-[#FDFBF7]/90 min-h-[4.5rem] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
