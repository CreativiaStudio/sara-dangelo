"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ─── Parallax photo tile ─── */
function PhotoTile({ src, alt, aspect, index }: { src: string; alt: string; aspect: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.15, 1.05, 1.05, 1.15]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className={`relative ${aspect} w-full overflow-hidden group`}
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
        />
      </motion.div>
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}

/* ─── Text tile ─── */
function TextTile({ line1, line2, line3, highlightLine = 1, index }: { line1: string; line2?: string; line3?: string; highlightLine?: 1 | 2 | 3; index: number }) {
  const getColorClass = (lineNum: 1 | 2 | 3) => {
    return highlightLine === lineNum ? "text-[#B89768]" : "text-[#FDFBF7]/90";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-30px" }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="flex items-center justify-center py-12 md:py-16 w-full"
    >
      <div className="text-center w-full">
        <span className={`block font-serif italic text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.2] ${getColorClass(1)}`}>
          {line1}
        </span>
        {line2 && (
          <span className={`block font-serif italic text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.2] mt-1 ${getColorClass(2)}`}>
            {line2}
          </span>
        )}
        {line3 && (
          <span className={`block font-serif italic text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.2] mt-1 ${getColorClass(3)}`}>
            {line3}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      data-theme="dark"
      className="relative text-[#FDFBF7] py-28 md:py-40 lg:py-48 overflow-hidden bg-[#362A22]"
    >
      {/* Deep gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(circle at top, #55453B 0%, #4A3B32 50%, #362A22 100%)" }}
      />
      <div className="noise-bg opacity-10 z-0 relative" />

      {/* Section intro */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl"
        >
          <span className="font-sans text-[11px] md:text-xs tracking-[0.35em] uppercase text-[#B89768] mb-8 block">
            Opere d&apos;Autore
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-[1.05] tracking-tight text-[#FDFBF7]">
            <span className="whitespace-nowrap">Spazi trasformati</span>
            <br />
            <span className="whitespace-nowrap">in <span className="italic font-light text-[#B89768]">emozione.</span></span>
          </h2>
          <p className="mt-8 md:mt-12 text-lg md:text-xl lg:text-2xl font-sans font-light text-[#FDFBF7]/80 leading-[1.8] max-w-3xl">
            Ogni progetto è un universo a sé. Stili diversi, anime diverse,
            <br className="hidden md:block" />
            un&apos;unica firma: la vostra.
          </p>
        </motion.div>
      </div>

      {/* ═══ EDITORIAL GRID ═══ */}
      <div className="relative z-10 max-w-[100rem] mx-auto px-4 lg:px-10">
        
        {/* Desktop Editorial Grid (3 columns) */}
        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 items-center">
          
          {/* Row 1 */}
          <div className="col-span-2">
            <PhotoTile src="/media/portfolio/_MAS0828.webp" alt="Event setup" aspect="aspect-[3/2]" index={0} />
          </div>
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/h_port_2.webp" alt="Details" aspect="aspect-[3/2]" index={1} />
          </div>

          {/* Row 2 */}
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/h_port_3.webp" alt="Decorations" aspect="aspect-[3/2]" index={2} />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <TextTile line1="Ogni" line2="dettaglio" line3="conta" highlightLine={2} index={3} />
          </div>
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/h_port_4.webp" alt="Venue" aspect="aspect-[3/2]" index={4} />
          </div>

          {/* Row 3 */}
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/h_port_5.webp" alt="Atmosphere" aspect="aspect-[3/2]" index={5} />
          </div>
          <div className="col-span-2">
            <PhotoTile src="/media/portfolio/h_port_6.webp" alt="Table setting" aspect="aspect-[3/2]" index={6} />
          </div>

          {/* Row 4 */}
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/_NEW_1.webp" alt="Night view" aspect="aspect-[3/2]" index={7} />
          </div>
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/h_port_8.webp" alt="Moments" aspect="aspect-[3/2]" index={8} />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <TextTile line1="La bellezza" line2="che resta" highlightLine={1} index={9} />
          </div>

          {/* Row 5 */}
          <div className="col-span-2">
            <PhotoTile src="/media/portfolio/_MAS1775.webp" alt="Gala dinner" aspect="aspect-[3/2]" index={10} />
          </div>
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/h_port_10.webp" alt="Elegance" aspect="aspect-[3/2]" index={11} />
          </div>

          {/* Row 6 */}
          <div className="col-span-1 flex items-center justify-center">
            <TextTile line1="Non esistono" line2="Eventi" line3="Banali" highlightLine={2} index={12} />
          </div>
          <div className="col-span-2">
            <PhotoTile src="/media/portfolio/h_port_11.webp" alt="Scenography" aspect="aspect-[3/2]" index={13} />
          </div>

          {/* Row 7: Closing */}
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/_NEW_3.webp" alt="Elegance details" aspect="aspect-[3/2]" index={14} />
          </div>
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/_NEW_4.webp" alt="Event vibes" aspect="aspect-[3/2]" index={15} />
          </div>
          <div className="col-span-1">
            <PhotoTile src="/media/portfolio/_NEW_5.webp" alt="Atmosphere closing" aspect="aspect-[3/2]" index={16} />
          </div>
          
        </div>

        {/* Mobile Grid (1 column) */}
        <div className="flex flex-col gap-6 md:hidden">
          <PhotoTile src="/media/portfolio/_MAS0828.webp" alt="Event setup" aspect="aspect-[3/2]" index={0} />
          <TextTile line1="Ogni" line2="dettaglio" line3="conta" highlightLine={2} index={1} />
          <PhotoTile src="/media/portfolio/h_port_2.webp" alt="Details" aspect="aspect-[3/2]" index={2} />
          <PhotoTile src="/media/portfolio/h_port_3.webp" alt="Decorations" aspect="aspect-[3/2]" index={3} />
          <PhotoTile src="/media/portfolio/h_port_6.webp" alt="Table setting" aspect="aspect-[3/2]" index={4} />
          <TextTile line1="La bellezza" line2="che resta" highlightLine={1} index={5} />
          <PhotoTile src="/media/portfolio/_MAS1775.webp" alt="Gala dinner" aspect="aspect-[3/2]" index={6} />
          <PhotoTile src="/media/portfolio/h_port_11.webp" alt="Scenography" aspect="aspect-[3/2]" index={7} />
          <TextTile line1="Non esistono" line2="Eventi" line3="Banali" highlightLine={2} index={8} />
          <PhotoTile src="/media/portfolio/_NEW_3.webp" alt="Elegance details" aspect="aspect-[3/2]" index={9} />
          <PhotoTile src="/media/portfolio/_NEW_4.webp" alt="Event vibes" aspect="aspect-[3/2]" index={10} />
          <PhotoTile src="/media/portfolio/_NEW_5.webp" alt="Atmosphere closing" aspect="aspect-[3/2]" index={11} />
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mt-28 md:mt-40"
      >
        <a
          href="#funnel"
          className="inline-block px-12 py-[18px] bg-[#B89768] text-[#FDFBF7] font-sans text-[11px] tracking-[0.3em] uppercase border border-[#B89768] hover:bg-[#FDFBF7] hover:border-[#FDFBF7] hover:text-[#4A3B32] transition-all duration-500"
        >
          Raccontami il tuo sogno
        </a>
      </motion.div>
    </section>
  );
}
