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
            
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.25rem] xl:text-[2.85rem] 2xl:text-[3.25rem] font-serif leading-[1.18] mb-8 text-[#4A3B32]">
              <span className="block">Il tuo matrimonio</span>
              <span className="italic font-light text-[#B89768] block md:whitespace-nowrap">
                firmato da una Wedding Architect.
              </span>
            </h2>

            <div className="space-y-5 font-sans font-light text-base md:text-lg leading-relaxed text-[#4A3B32]/85">

              {/* Paragrafo 1 — La convinzione */}
              <p>
                Sono convinta che un matrimonio indimenticabile non nasca dalla semplice somma di fiori, arredi e decorazioni, ma da un progetto capace di mettere in relazione <strong className="font-medium text-[#4A3B32]">spazio, estetica, funzionalità e atmosfera.</strong>
              </p>

              {/* Paragrafo 2 — Il metodo architetturale */}
              <p>
                Come <strong className="font-semibold text-[#4A3B32]">Wedding Architect</strong>, applico al matrimonio il mio metodo di architetto: studio gli spazi, i percorsi, le proporzioni, i punti di vista e il modo in cui il progetto si integra con l&apos;identità della location, valorizzandola senza mai snaturarla. Ogni scelta viene pensata non come un elemento isolato, ma come parte di un&apos;unica esperienza.
              </p>

              {/* Callout — Il vantaggio per voi */}
              <div className="border-l-2 border-[#B89768] pl-5 py-1 my-2">
                <p className="text-sm md:text-base text-[#4A3B32]/90">
                  <span className="font-semibold text-[#4A3B32] not-italic block mb-1">Il vantaggio per voi?</span>
                  Avere una visione completa dell&apos;evento prima ancora che il progetto prenda forma. Una regia attenta accompagnerà ogni fase, coordinando tempi, spazi e professionisti affinché tutto prenda vita con la stessa armonia con cui è stato concepito.
                </p>
              </div>

            </div>

            {/* Signature Badge */}
            <div className="mt-10 pt-8 border-t border-[#4A3B32]/10 flex items-center justify-between">
              <div>
                <span className="font-serif italic text-2xl text-[#4A3B32] block">Sara D&apos;Angelo</span>
                <span className="font-sans text-xs tracking-widest uppercase text-[#B89768]">Wedding Architect</span>
              </div>
              <div className="text-right">
                <span className="font-serif italic text-xl text-[#B89768] block">10+ Anni</span>
                <span className="font-sans text-[10px] tracking-widest uppercase text-[#4A3B32]/60 block">di Progettazione</span>
                <span className="font-sans text-[10px] tracking-widest uppercase text-[#4A3B32]/60 block">di Eventi Esclusivi</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
