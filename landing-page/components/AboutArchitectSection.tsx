"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function AboutArchitectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={sectionRef} id="about" className="py-24 md:py-36 lg:py-48 bg-[#FDFBF7] overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-16">
        
        {/* Left: Portrait */}
        <div className="w-full lg:w-[45%] relative">
          <motion.div 
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative w-[90%] md:w-[85%] aspect-[3/4] mx-auto photo-frame z-10"
          >
            <Image
               src="/media/sara-portrait.webp" 
               alt="Sara D'Angelo Portrait"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 90vw, 40vw"
            />
            <div className="absolute inset-0 bg-[#4A3B32]/10 mix-blend-overlay"></div>
          </motion.div>

          {/* Decorative element */}
          <div className="absolute top-1/2 -left-10 lg:-left-20 -translate-y-1/2 text-[12rem] lg:text-[18rem] font-serif italic text-[#B89768]/[0.04] select-none pointer-events-none">
            S
          </div>
        </div>
        
        {/* Right: Text */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-6 block">Dietro le quinte</span>
            <h2 className="text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-serif text-[#4A3B32] leading-[1.1] mb-8">
              <span className="block lg:whitespace-nowrap">La forma dei vostri sogni.</span>
              <span className="block italic font-light text-[#B89768] lg:whitespace-nowrap">Costruita per non svanire mai.</span>
            </h2>
            <div className="editorial-line mb-8" />
            <div className="w-full">
              <p className="font-sans font-light text-[#4A3B32]/80 text-base md:text-lg leading-[1.9] mb-6">
                <span className="font-medium text-[#4A3B32]">Tutto inizia dai vostri sogni,</span>{" "}ma è la cura millimetrica a renderli reali. Il mio percorso di studi in architettura è la promessa di un design di livello superiore: linee pulite, proporzioni impeccabili e un&apos;armonia che si respira in ogni dettaglio.
              </p>
              <p className="font-sans font-light text-[#4A3B32]/80 text-base md:text-lg leading-[1.9] mb-4">
                Quello che vedrete è pura poesia visiva. Quello che non vedrete è la struttura che la sostiene: una macchina logistica affinata in quasi vent&apos;anni di matrimoni, che non ammette imprevisti.{" "}
                <span className="font-medium text-[#4A3B32]">Il vostro unico compito sarà godervi la festa.</span>
              </p>
            </div>
            <div className="mt-12 w-48 md:w-64">
               <Image 
                 src="/sara-dangelo-wedding-architect-logo.png" 
                 alt="Sara D'Angelo Wedding Architect" 
                 width={400} 
                 height={150} 
                 className="w-full h-auto opacity-80 mix-blend-multiply"
               />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
