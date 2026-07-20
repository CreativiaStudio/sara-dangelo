"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const reviews = [
  {
    quote:
      "Sara ha una straordinaria capacità di ascolto. Ha trasformato i nostri desideri in una scenografia perfetta. La sua presenza è stata la nostra pace mentale.",
    author: "Federica & Antonio",
    location: "Recensione Verificata",
    imgSrc: "/media/reviews/review_1.webp"
  },
  {
    quote:
      "La sua regia invisibile ci ha regalato una serenità assoluta. Non abbiamo dovuto pensare a nulla, se non a goderci la magia del nostro giorno.",
    author: "Martina & Luigi",
    location: "Recensione Verificata",
    imgSrc: "/media/reviews/review_2.webp"
  },
  {
    quote:
      "Una vera Architetto del matrimonio. Geometrie, luci, fiori: un livello di eleganza superiore. Ha saputo esaltare la location in modo irripetibile.",
    author: "Chiara & Roberto",
    location: "Recensione Verificata",
    imgSrc: "/media/reviews/review_3.webp"
  },
];

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="social-proof"
      className="relative py-24 md:py-32 lg:py-48 bg-[#FDFBF7] overflow-hidden"
    >
      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#4A3B32]/10 pb-8"
        >
          <span className="label-caps block">Esperienze Autentiche</span>
          
          {/* Controls */}
          <div className="flex gap-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-[2px] transition-all duration-700 ${
                  idx === current
                    ? "bg-[#B89768] w-12"
                    : "bg-[#4A3B32]/20 w-8 hover:bg-[#4A3B32]/50"
                }`}
                aria-label={`Vai alla recensione ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Split Screen Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left: Photo */}
          <div className="w-full lg:w-[45%] relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] photo-frame shadow-2xl overflow-hidden shrink-0">
            <AnimatePresence>
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={reviews[current].imgSrc}
                  alt={`Matrimonio di ${reviews[current].author}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Text */}
          <div className="w-full lg:w-[55%] relative flex flex-col justify-center min-h-[300px]">
            {/* Huge Quote Mark Background */}
            <div className="absolute -top-10 -left-6 md:-left-10 text-[10rem] md:text-[16rem] font-serif italic text-[#B89768]/[0.05] leading-none pointer-events-none select-none z-0">
              &ldquo;
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <p className="text-[1.75rem] md:text-4xl lg:text-[2.75rem] font-serif italic leading-[1.3] text-[#4A3B32] mb-10 md:mb-14">
                  {reviews[current].quote}
                </p>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-px bg-[#B89768]" />
                  <div>
                    <p className="font-sans tracking-[0.2em] uppercase text-xs md:text-sm text-[#4A3B32] font-semibold mb-1">
                      {reviews[current].author}
                    </p>
                    <p className="font-serif italic text-sm text-[#4A3B32]/60">
                      {reviews[current].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
