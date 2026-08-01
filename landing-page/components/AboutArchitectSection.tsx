"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutArchitectSection() {
  return (
    <section id="about" className="relative py-28 md:py-40 bg-[#FDFBF7] text-[#4A3B32] overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[45%] relative aspect-[4/5] photo-frame shadow-2xl overflow-hidden shrink-0"
          >
            <Image
              src="/media/sara-portrait.webp"
              alt="Sara D'Angelo — Wedding Architect"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-[#4A3B32]/5 pointer-events-none" />
          </motion.div>

          {/* Right: Direct First Person Copy ("Io" -> "Voi") */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[55%] flex flex-col justify-center"
          >
            <span className="label-caps mb-6 block text-[#B89768]">La Mia Filosofia</span>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.15] mb-8 text-[#4A3B32]">
              Perché scegliere me come <br className="hidden md:block" />
              <span className="italic font-light text-[#B89768]">vostra Wedding Architect</span>
            </h2>

            <div className="space-y-6 font-sans font-light text-base md:text-lg leading-relaxed text-[#4A3B32]/85">
              <p>
                Sono convinta che un matrimonio indimenticabile non nasca dalla semplice somma di fiori e decorazioni, ma da uno studio approfondito dello spazio e dei flussi del vostro evento. 
              </p>
              <p>
                Come <strong className="font-semibold text-[#4A3B32]">Wedding Architect</strong>, metto il mio percorso di architettura al servizio dei vostri sogni. Il vantaggio per voi? Nessun imprevisto, un&apos;armonia visiva perfetta e la totale serenità di godervi la festa mentre la mia regia invisibile coordina ogni dettaglio.
              </p>
              <p className="text-sm md:text-base italic text-[#B89768] pt-2">
                Disegno e firmo matrimoni esclusivi a Napoli, in Costiera Amalfitana, a Capri, in Puglia e nei più affascinanti castelli d&apos;Italia.
              </p>
            </div>

            {/* Signature Badge */}
            <div className="mt-10 pt-8 border-t border-[#4A3B32]/10 flex items-center justify-between">
              <div>
                <span className="font-serif italic text-2xl text-[#4A3B32] block">Sara D&apos;Angelo</span>
                <span className="font-sans text-xs tracking-widest uppercase text-[#B89768]">Wedding Architect</span>
              </div>
              <div className="text-right">
                <span className="font-serif italic text-xl text-[#B89768] block">14+ Anni</span>
                <span className="font-sans text-xs tracking-widest uppercase text-[#4A3B32]/60">di Progettazione</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
