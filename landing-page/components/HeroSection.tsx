"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

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
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full flex items-center overflow-hidden bg-[#FDFBF7]"
    >
      {/* Content — Asymmetric layout */}
      <motion.div
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-16 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col justify-center min-h-[100svh]"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24 w-full">
          {/* Left — Text */}
          <div className="w-full lg:w-[55%] flex flex-col">
            {/* Pre-title label */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mb-6 md:mb-8"
            >
              <span className="label-caps">
                Wedding Architect — Napoli & Costiera
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={titleContainer}
              initial="hidden"
              animate="show"
              className="text-[clamp(2.5rem,5vw,6.5rem)] font-serif leading-[1.05] tracking-tight mb-8 flex flex-col"
            >
              <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
                <motion.span variants={titleItem} className="block sm:whitespace-nowrap text-[0.8em] title-shimmer pb-[0.2em]">
                  Non organizzo eventi,
                </motion.span>
              </div>
              <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
                <motion.span
                  variants={titleItem}
                  className="block italic font-light text-[#B89768] whitespace-nowrap pr-4 text-[1.25em] gold-shimmer pb-[0.2em]"
                >
                  li progetto.
                </motion.span>
              </div>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.125rem,1.5vw,1.375rem)] text-[#4A3B32]/80 font-sans font-light leading-relaxed max-w-2xl mb-10 md:mb-12"
            >
              Oltre 14 anni di esperienza al servizio di matrimoni esclusivi.<br className="hidden md:block" />
              Il mio metodo unisce visione d&apos;insieme, geometrie perfette e<br className="hidden md:block" />
              controllo dei dettagli per un progetto dal design impeccabile.
            </motion.p>

            {/* CTA Removed as requested */}
          </div>

          {/* Right — Single Perfect Photo */}
          <div className="w-full lg:w-[45%] relative mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <motion.div
               style={{ y: photoY }}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
               className="relative w-full max-w-[450px] aspect-[4/5] photo-frame z-10 shadow-2xl"
            >
              <Image
                src="/media/hero-lancellotti.webp"
                alt="Castello Lancellotti Design"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                quality={90}
              />
              <div className="absolute inset-0 bg-[#4A3B32]/5 mix-blend-overlay" />
            </motion.div>
            
            {/* Decorative line */}
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
                className="absolute top-[10%] -left-8 h-32 w-[1px] bg-[#B89768]/40 origin-top hidden lg:block"
            />
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#B89768]/30 to-[#B89768]/10" />
      </motion.div>
    </section>
  );
}
