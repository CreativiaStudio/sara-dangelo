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
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: [0.16, 1, 0.3, 1] as const },
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
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#1A140E]"
    >
      {/* Background Video — Vivid & Clear */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-90 scale-105"
        >
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Soft Vignette Overlay: Keeps video clear while guaranteeing 100% text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A140E]/75 via-[#1A140E]/40 to-[#1A140E]/85 pointer-events-none" />
      </div>

      {/* Content — Centered Layout Above-the-Fold */}
      <motion.div
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-16 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 flex flex-col items-center justify-center text-center"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Main headline — 3 Explicit Rows on Desktop & Mobile */}
          <motion.h1
            variants={titleContainer}
            initial="hidden"
            animate="show"
            className="text-[clamp(1.85rem,4.2vw,4.4rem)] md:text-[clamp(2.2rem,4.6vw,5rem)] font-serif leading-[1.12] tracking-tight mb-4 md:mb-5 text-[#FDFBF7] flex flex-col items-center max-w-5xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
          >
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.span variants={titleItem} className="block whitespace-nowrap pb-[0.15em]">
                Non organizzo Matrimoni,
              </motion.span>
            </div>
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.span
                variants={titleItem}
                className="block italic font-light text-[#E5D2B5] pb-[0.15em] text-center whitespace-nowrap drop-shadow-[0_4px_24px_rgba(184,151,104,0.5)]"
              >
                li progetto dando vita
              </motion.span>
            </div>
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.span
                variants={titleItem}
                className="block italic font-light text-[#E5D2B5] pb-[0.15em] text-center whitespace-nowrap drop-shadow-[0_4px_24px_rgba(184,151,104,0.5)]"
              >
                ai vostri sogni.
              </motion.span>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(0.95rem,1.15vw,1.25rem)] text-[#FDFBF7] font-sans font-light leading-relaxed max-w-2xl mx-auto mb-7 md:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          >
            Oltre 10 anni di esperienza al servizio di matrimoni esclusivi.<br className="hidden md:block" />
            Il mio metodo unisce armonia degli spazi, regia invisibile e<br className="hidden md:block" />
            precisione sartoriale per farvi vivere un'esperienza impeccabile.
          </motion.p>

          {/* Primary CTA Button — Solid Gold with Animated Shimmer Light Sweep */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <a
              href="#contact"
              className="relative inline-flex items-center gap-3.5 bg-[#B89768] text-[#1A140E] px-7 md:px-10 py-3.5 md:py-4 font-sans uppercase tracking-[0.22em] text-xs md:text-sm font-bold shadow-[0_10px_35px_rgba(184,151,104,0.5)] hover:shadow-[0_15px_45px_rgba(184,151,104,0.7)] hover:bg-[#FDFBF7] hover:text-[#1A140E] hover:scale-105 transition-all duration-300 rounded-sm overflow-hidden group z-20"
            >
              {/* Shimmer Light Beam */}
              <motion.span 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full h-full pointer-events-none"
              />
              <span className="relative z-10">Prenota la Consulenza Conoscitiva (30 min)</span>
              <svg className="relative z-10 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 1.8, duration: 1.2 }}
        className="hidden md:flex absolute bottom-2 left-1/2 -translate-x-1/2 flex-col items-center z-10 pointer-events-none"
      >
        <div className="w-[1px] h-8 lg:h-12 bg-gradient-to-b from-transparent via-[#B89768]/60 to-transparent" />
      </motion.div>
    </section>
  );
}
