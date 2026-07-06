"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ─── Photo & text tiles data ─── */
type Tile =
  | { type: "photo"; src: string; alt: string; aspect: string }
  | { type: "text"; line1: string; line2?: string; line3?: string; wide?: boolean; highlightLine?: 1 | 2 | 3 };

const col1: Tile[] = [
  { type: "photo", src: "/media/mosaic/lancellotti-1.webp", alt: "Atmosfera al castello", aspect: "aspect-[3/4]" },
  { type: "text", line1: "Ogni", line2: "dettaglio", line3: "conta", highlightLine: 2 },
  { type: "photo", src: "/media/mosaic/campolieto-1.webp", alt: "Allestimento regale", aspect: "aspect-[4/5]" },
  { type: "photo", src: "/media/mosaic/detail-1.webp", alt: "Dettaglio floreale", aspect: "aspect-[3/4]" },
  { type: "photo", src: "/media/mosaic/lancellotti-2.webp", alt: "Atmosfera serale", aspect: "aspect-[4/5]" },
];

const col2: Tile[] = [
  { type: "photo", src: "/media/mosaic/marechiaro-1.webp", alt: "Vista mare a Marechiaro", aspect: "aspect-[3/4]" },
  { type: "photo", src: "/media/mosaic/caruso-1.webp", alt: "Vista mare da Ravello", aspect: "aspect-[4/5]" },
  { type: "photo", src: "/media/mosaic/bellevue-1.webp", alt: "Eleganza al tramonto", aspect: "aspect-[3/4]" },
  { type: "text", line1: "La bellezza", line2: "che resta" },
  { type: "photo", src: "/media/mosaic/daniela-1.webp", alt: "Emozione degli sposi", aspect: "aspect-[4/5]" },
];

const col3: Tile[] = [
  { type: "photo", src: "/media/mosaic/capri-1.webp", alt: "Capri al crepuscolo", aspect: "aspect-[4/5]" },
  { type: "photo", src: "/media/mosaic/taurinus-1.webp", alt: "Mise en place di gala", aspect: "aspect-[3/4]" },
  { type: "text", line1: "Non esistono", line2: "Eventi", line3: "Banali", highlightLine: 2 },
  { type: "photo", src: "/media/mosaic/cristoforo-1.webp", alt: "Scenografia luminosa", aspect: "aspect-[4/5]" },
];

const col4: Tile[] = [
  { type: "text", line1: "Sogni", line2: "su misura" },
  { type: "photo", src: "/media/mosaic/scraio-1.webp", alt: "Banchetto sulla costa", aspect: "aspect-[3/4]" },
  { type: "photo", src: "/media/mosaic/angelina-1.webp", alt: "Giardino incantato", aspect: "aspect-[4/5]" },
  { type: "photo", src: "/media/mosaic/detail-2.webp", alt: "Composizione floreale", aspect: "aspect-[3/4]" },
  { type: "text", line1: "Ogni storia merita", line2: "un progetto", line3: "che nasca solo per lei", wide: true, highlightLine: 2 },
];

// Mobile gets 2 columns with interleaved tiles from all 4 columns
const mobileTiles: Tile[] = [
  col1[0], col2[0], // two photos
  col1[1], // text: Ogni dettaglio conta
  col3[0], col4[1], // two photos
  col2[3], // text: La bellezza che resta
  col1[2], col3[1], // two photos
  col3[2], // text: Non esistono momenti banali
  col2[1], col4[2], // two photos
  col4[0], // text: Sogni su misura
  col1[3], col2[2], // two photos
  col1[4], col2[4], // two photos
  col3[3], col4[3], // two photos
  col4[4], // text: Ogni storia merita...
];

const columns = [col1, col2, col3, col4];

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
          sizes="(max-width: 768px) 50vw, 25vw"
          quality={80}
        />
      </motion.div>
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}

/* ─── Text tile ─── */
function TextTile({ line1, line2, line3, wide, highlightLine = 1, index }: { line1: string; line2?: string; line3?: string; wide?: boolean; highlightLine?: 1 | 2 | 3; index: number }) {
  // If wide, we break out of the column to the left so the text has more horizontal space
  const containerClass = wide 
    ? "md:w-[150%] md:-ml-[50%] lg:w-[180%] lg:-ml-[80%] z-20 relative" 
    : "";
    
  const getColorClass = (lineNum: 1 | 2 | 3) => {
    return highlightLine === lineNum ? "text-[#B89768]" : "text-[#FDFBF7]/90";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-30px" }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className={`flex items-center justify-center py-12 md:py-16 ${containerClass}`}
    >
      <div className="text-center w-full">
        <span className={`block font-serif italic text-3xl md:text-4xl lg:text-5xl leading-[1.2] ${getColorClass(1)}`}>
          {line1}
        </span>
        {line2 && (
          <span className={`block font-serif italic text-3xl md:text-4xl lg:text-5xl leading-[1.2] mt-1 ${getColorClass(2)}`}>
            {line2}
          </span>
        )}
        {line3 && (
          <span className={`block font-serif italic text-3xl md:text-4xl lg:text-5xl leading-[1.2] mt-1 ${getColorClass(3)}`}>
            {line3}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Column renderer ─── */
function MosaicColumn({ tiles, colIndex }: { tiles: Tile[]; colIndex: number }) {
  // Stagger offset: odd columns start lower for asymmetry
  const offsetClass = colIndex % 2 === 1 ? "md:mt-20" : "";

  return (
    <div className={`flex flex-col gap-4 md:gap-5 ${offsetClass}`}>
      {tiles.map((tile, i) =>
        tile.type === "photo" ? (
          <PhotoTile key={i} src={tile.src} alt={tile.alt} aspect={tile.aspect} index={i} />
        ) : (
          <TextTile key={i} line1={tile.line1} line2={tile.line2} line3={tile.line3} wide={tile.wide} highlightLine={tile.highlightLine} index={i} />
        )
      )}
    </div>
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

      {/* ═══ MOSAIC GRID — Desktop: 4 columns ═══ */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-4 lg:px-10">
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-5">
          {columns.map((col, i) => (
            <MosaicColumn key={i} tiles={col} colIndex={i} />
          ))}
        </div>

        {/* Mobile grid — 2 columns */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {mobileTiles.map((tile, i) =>
            tile.type === "photo" ? (
              <PhotoTile key={i} src={tile.src} alt={tile.alt} aspect={tile.aspect} index={i} />
            ) : (
              <div key={i} className="col-span-2">
                <TextTile line1={tile.line1} line2={tile.line2} line3={tile.line3} wide={tile.wide} highlightLine={tile.highlightLine} index={i} />
              </div>
            )
          )}
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
