"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const points = [
  {
    num: "01",
    imgSrc: "/media/icone/1.webp",
    title: "Visione d'Insieme",
    desc: "Ascolto la vostra storia, studio la location e comprendo lo stile che vi rappresenta. È il primo incontro in cui definiamo insieme la direzione creativa del vostro evento."
  },
  {
    num: "02",
    imgSrc: "/media/icone/2.webp",
    title: "Design degli Spazi",
    desc: "Disegno planimetrie, scenografie e percorsi ispirandomi ai principi dell'interior design. Un'armonia che si respira in ogni elemento, per farvi vivere il vostro evento con naturalezza."
  },
  {
    num: "03",
    imgSrc: "/media/icone/3.webp",
    title: "Eleganza Logica",
    desc: "Dietro ogni progetto c'è un lavoro di coordinamento che non vedrete mai. Seleziono i migliori fornitori, ottimizzo le risorse e gestisco ogni aspetto organizzativo perché tutto funzioni alla perfezione."
  },
  {
    num: "04",
    imgSrc: "/media/icone/4.webp",
    title: "Regia Invisibile",
    desc: "Il giorno dell'evento, tutto scorre in modo naturale. Una regia attenta e discreta, costruita nei mesi precedenti, perché il vostro unico pensiero sia vivere ogni istante."
  }
];

export default function MethodSection() {
  return (
    <section
      id="metodo"
      className="py-24 md:py-32 lg:py-48 bg-[#F5EFE6] text-[#4A3B32] relative overflow-hidden"
    >
      <div className="max-w-[90rem] mx-auto px-6 lg:px-16">
        {/* Title */}
        <div className="mb-24 md:mb-32 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-8 block text-center">Il Metodo Progettuale</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-[#4A3B32]">
              Perché scegliere una <br className="hidden md:block"/>
              <span className="italic font-light text-[#B89768]">Wedding Architect</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B89768]/60 to-transparent mx-auto mt-12" />
          </motion.div>
        </div>

        {/* 4 Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-12 gap-y-20 lg:gap-y-24">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              className="flex flex-col items-center text-center relative group"
            >
              {/* Background large numbers */}
              <div className="absolute top-0 md:-top-10 left-1/2 -translate-x-1/2 text-[10rem] md:text-[12rem] font-serif italic text-[#B89768]/[0.05] leading-none pointer-events-none select-none z-0 transition-transform duration-1000 group-hover:scale-105">
                {point.num}
              </div>
              
              {/* Icon */}
              <div className="mb-8 z-10 relative mt-12 md:mt-0">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border border-[#B89768]/30 flex items-center justify-center bg-[#FFFFFF] shadow-[0_10px_40px_-10px_rgba(184,151,104,0.15)] transition-all duration-700 group-hover:border-[#B89768]/80 group-hover:-translate-y-2 overflow-hidden relative">
                  <Image src={point.imgSrc} alt={point.title} fill className="object-contain p-6 mix-blend-multiply" sizes="(max-width: 768px) 128px, 144px" />
                </div>
              </div>
              
              {/* Text */}
              <h3 className="text-2xl font-serif mb-6 text-[#4A3B32] z-10">
                {point.title}
              </h3>
              
              <p className="font-sans font-light text-[#4A3B32]/80 text-base leading-[1.9] max-w-[90%] md:max-w-full z-10">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
