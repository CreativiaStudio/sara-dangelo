"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const photos = [
  {
    src: "/media/portfolio-1.webp",
    alt: "Dettaglio — Il Giorno Perfetto",
    label: "Eleganza senza tempo",
    widthClass: "md:w-[72%]",
    align: "ml-auto" as const,
  },
  {
    src: "/media/geometrie.webp",
    alt: "Allestimento d'autore",
    label: "Geometrie ed Emozioni",
    widthClass: "md:w-[72%]",
    align: "mr-auto" as const,
  },
  {
    src: "/media/sara-dangelo-wedding99.webp",
    alt: "Design d'Autore",
    label: "Progettare l'emozione",
    widthClass: "md:w-[72%]",
    align: "ml-auto" as const,
  },
];

function ParallaxPhoto({
  photo,
  index,
}: {
  photo: (typeof photos)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.6]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`w-[90%] ${photo.widthClass} ${photo.align} relative`}
    >
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)", scale: 0.95, opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 1 }}
        exit={{ clipPath: "inset(100% 0 0 0)", scale: 0.95, opacity: 0 }}
        viewport={{ once: false, margin: "0px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-[16/10] md:aspect-[16/8] overflow-hidden photo-frame"
      >
        <motion.div style={{ y, scale: scale }} className="w-full h-full absolute inset-0">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 80vw"
            quality={85}
          />
          {/* Subtle warm overlay on edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7]/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Location label */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 30, filter: "blur(5px)" }}
        viewport={{ once: false, margin: "0px" }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-8 ${index % 2 === 0 ? "text-right" : "text-left"}`}
      >
        <span className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-[#B89768] leading-tight">
          {photo.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoStripSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FDFBF7] overflow-hidden">
      {/* Intro text — minimal */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-20 md:mb-28 px-6"
      >
        <div className="editorial-line-wide mx-auto mb-8" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-[#4A3B32]/80 max-w-4xl mx-auto leading-[1.3] text-center">
          &ldquo;La forma più pura del lusso
          <br className="hidden md:block" />
          è godersi ogni istante.&rdquo;
        </p>
      </motion.div>

      {/* Photos — full bleed, staggered */}
      <div className="flex flex-col gap-6 md:gap-10 max-w-[95rem] mx-auto px-4 md:px-8">
        {photos.map((photo, i) => (
          <ParallaxPhoto key={i} photo={photo} index={i} />
        ))}
      </div>
    </section>
  );
}
