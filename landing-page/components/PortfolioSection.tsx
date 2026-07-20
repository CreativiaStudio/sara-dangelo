"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ─── Data: 4 Albums ─── */
const albums = [
  {
    id: "lancellotti",
    title: "Castello Lancellotti",
    photos: [
      { src: "/media/portfolio/_MAS0828.webp", alt: "Event setup", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-2" },
      { src: "/media/portfolio/h_port_2.webp", alt: "Details", aspect: "aspect-[3/2]", span: "col-span-1" },
      { src: "/media/portfolio/h_port_3.webp", alt: "Decorations", aspect: "aspect-[3/2]", span: "col-span-1" },
      { src: "/media/portfolio/h_port_4.webp", alt: "Atmosphere", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-2" },
    ]
  },
  {
    id: "cimbrone",
    title: "Villa Cimbrone",
    photos: [
      { src: "/media/portfolio/h_port_5.webp", alt: "Green setup", aspect: "aspect-[3/2]", span: "col-span-1" },
      { src: "/media/portfolio/h_port_6.webp", alt: "Table setting", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-2" },
      { src: "/media/portfolio/_NEW_1.webp", alt: "Night view", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-2" },
      { src: "/media/portfolio/h_port_8.webp", alt: "Moments", aspect: "aspect-[3/2]", span: "col-span-1" },
    ]
  },
  {
    id: "campolieto",
    title: "Tenuta di Campolieto",
    photos: [
      { src: "/media/portfolio/_MAS1775.webp", alt: "Gala dinner", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-2" },
      { src: "/media/portfolio/h_port_10.webp", alt: "Elegance", aspect: "aspect-[3/2]", span: "col-span-1" },
      { src: "/media/portfolio/h_port_11.webp", alt: "Scenography", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-3" },
    ]
  },
  {
    id: "federica",
    title: "Il Matrimonio di Federica",
    photos: [
      { src: "/media/portfolio/_NEW_3.webp", alt: "Elegance details", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-2" },
      { src: "/media/portfolio/_NEW_4.webp", alt: "Event vibes", aspect: "aspect-[3/2]", span: "col-span-1" },
      { src: "/media/portfolio/_NEW_5.webp", alt: "Atmosphere closing", aspect: "aspect-[3/2]", span: "col-span-1 md:col-span-3" },
    ]
  }
];

/* ─── Parallax photo tile ─── */
function PhotoTile({ src, alt, aspect, span, index }: { src: string; alt: string; aspect: string; span: string; index: number }) {
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
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={`relative w-full overflow-hidden group ${span} ${aspect}`}
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


/* ─── Main export ─── */
export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState(albums[0].id);

  const activeAlbum = albums.find(a => a.id === activeTab);

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

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16">
        
        {/* Section intro & Tabs Header */}
        <div className="mb-20 md:mb-28 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center w-full max-w-4xl"
          >
            <span className="label-caps mb-8 block text-[#B89768]">Racconti Visivi</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-[#FDFBF7] mb-16">
              Spazi trasformati in <span className="italic font-light text-[#B89768]">emozione.</span>
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-[#FDFBF7]/10 pb-6">
              {albums.map((album) => {
                const isActive = activeTab === album.id;
                return (
                  <button
                    key={album.id}
                    onClick={() => setActiveTab(album.id)}
                    className="relative pb-2 px-2 transition-colors duration-500 group"
                  >
                    <span className={`font-sans tracking-widest uppercase text-[10px] md:text-xs transition-colors duration-500 ${isActive ? "text-[#B89768] font-medium" : "text-[#FDFBF7]/50 group-hover:text-[#FDFBF7]/80"}`}>
                      {album.title}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B89768]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Album Grid */}
        <div className="min-h-[800px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {activeAlbum?.photos.map((photo, i) => (
                <PhotoTile
                  key={`${activeTab}-${i}`}
                  src={photo.src}
                  alt={photo.alt}
                  aspect={photo.aspect}
                  span={photo.span}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-28 md:mt-40 text-center"
        >
          <p className="font-serif italic text-2xl md:text-3xl text-[#FDFBF7]/70 mb-10">
            Ogni storia ha un design unico. Quale sarà il vostro?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-4 bg-transparent border border-[#B89768]/50 text-[#FDFBF7] px-10 py-5 font-sans uppercase tracking-[0.2em] text-[11px] hover:bg-[#B89768] hover:text-[#2A2118] hover:border-[#B89768] transition-all duration-700"
          >
            Inizia il Progetto
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
