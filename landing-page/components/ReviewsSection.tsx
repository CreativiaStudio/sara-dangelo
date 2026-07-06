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
  },
  {
    quote:
      "La sua regia invisibile ci ha regalato una serenità assoluta. Non abbiamo dovuto pensare a nulla, se non a goderci la magia del nostro giorno.",
    author: "Martina & Luigi",
    location: "Recensione Verificata",
  },
  {
    quote:
      "Una vera Architetto del matrimonio. Geometrie, luci, fiori: un livello di eleganza superiore. Ha saputo esaltare la location in modo irripetibile.",
    author: "Chiara & Roberto",
    location: "Recensione Verificata",
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
      className="relative py-32 md:py-44 lg:py-52 overflow-hidden"
    >
      {/* Background photo — soft, defocused */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/media/campolieto-flowers.webp"
          alt=""
          fill
          className="object-cover scale-110 blur-[2px]"
          sizes="100vw"
          quality={60}
        />
        {/* Warm cream overlay — keeps it luminous */}
        <div className="absolute inset-0 bg-[#FDFBF7]/88" />
        <div className="noise-bg" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="label-caps mb-16 block">Dicono di Noi</span>
        </motion.div>

        {/* Quote */}
        <div className="relative min-h-[320px] md:min-h-[280px] flex items-center justify-center">
          {/* Decorative quote mark */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10rem] md:text-[14rem] font-serif text-[#B89768]/[0.07] leading-none select-none pointer-events-none">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic leading-[1.3] md:leading-[1.35] text-[#4A3B32] mb-10 md:mb-14 max-w-4xl mx-auto">
                {reviews[current].quote}
              </p>

              <div className="editorial-line mx-auto mb-8" />

              <p className="font-sans tracking-[0.3em] uppercase text-[11px] md:text-xs text-[#4A3B32] font-medium mb-2">
                {reviews[current].author}
              </p>
              <p className="font-serif italic text-sm md:text-base text-[#B89768]/70">
                {reviews[current].location}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-16">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-[3px] rounded-full transition-all duration-700 ${
                idx === current
                  ? "bg-[#B89768] w-10"
                  : "bg-[#4A3B32]/15 w-6 hover:bg-[#4A3B32]/30"
              }`}
              aria-label={`Vai alla recensione ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
