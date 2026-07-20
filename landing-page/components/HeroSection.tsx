"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const titleContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const titleItem = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        >
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Elegant overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A2118]/60 via-[#2A2118]/40 to-[#2A2118]/80" />
      </div>

      {/* Content — Centered Cinematic Layout */}
      <motion.div
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-16 flex flex-col items-center justify-center text-center"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Pre-title label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-8"
        >
          <span className="font-sans text-xs tracking-[0.35em] uppercase text-[#B89768]">
            Wedding Architect — Napoli & Costiera
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="show"
          className="text-[clamp(1.8rem,4vw,5rem)] md:text-[clamp(2.5rem,5vw,6rem)] font-serif leading-[1.1] tracking-tight mb-8 text-[#FDFBF7] flex flex-col items-center"
        >
          <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
            <motion.span variants={titleItem} className="block sm:whitespace-nowrap pb-[0.2em]">
              Non organizzo Eventi,
            </motion.span>
          </div>
          <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
            <motion.span
              variants={titleItem}
              className="block italic font-light text-[#B89768] pb-[0.2em] text-center"
            >
              li progetto dando vita ai vostri sogni.
            </motion.span>
          </div>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1rem,1.2vw,1.25rem)] text-[#FDFBF7]/80 font-sans font-light leading-relaxed max-w-2xl"
        >
          Oltre 14 anni di esperienza al servizio di matrimoni esclusivi.<br className="hidden md:block" />
          Il mio metodo unisce visione d&apos;insieme, geometrie perfette e<br className="hidden md:block" />
          controllo dei dettagli per un progetto dal design impeccabile.
        </motion.p>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#B89768]/60 to-transparent" />
      </motion.div>
    </section>
  );
}
