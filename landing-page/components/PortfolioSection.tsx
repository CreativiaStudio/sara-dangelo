"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const albumData = [
  {
    id: "capri",
    title: "Capri",
    subtitle: "Villa & Panorama a Capri",
    images: [
      "/media/albums/capri/img_1.webp",
      "/media/albums/capri/img_2.webp",
      "/media/albums/capri/img_3.webp",
      "/media/albums/capri/img_4.webp",
      "/media/albums/capri/img_5.webp",
      "/media/albums/capri/img_6.webp",
      "/media/albums/capri/img_7.webp",
      "/media/albums/capri/img_8.webp",
      "/media/albums/capri/img_9.webp",
      "/media/albums/capri/img_10.webp",
      "/media/albums/capri/img_11.webp",
      "/media/albums/capri/img_12.webp",
    ]
  },
  {
    id: "lancellotti",
    title: "Castello Lancellotti",
    subtitle: "Dimora Storica — Lauro",
    images: [
      "/media/albums/lancellotti/img_1.webp",
      "/media/albums/lancellotti/img_2.webp",
      "/media/albums/lancellotti/img_3.webp",
      "/media/albums/lancellotti/img_4.webp",
      "/media/albums/lancellotti/img_5.webp",
      "/media/albums/lancellotti/img_6.webp",
      "/media/albums/lancellotti/img_7.webp",
      "/media/albums/lancellotti/img_8.webp",
      "/media/albums/lancellotti/img_9.webp",
      "/media/albums/lancellotti/img_10.webp",
      "/media/albums/lancellotti/img_11.webp",
    ]
  },
  {
    id: "margherita",
    title: "Salone Margherita",
    subtitle: "Scenografia & Design — Napoli",
    images: [
      "/media/albums/margherita/img_1.webp",
      "/media/albums/margherita/img_2.webp",
      "/media/albums/margherita/img_3.webp",
      "/media/albums/margherita/img_4.webp",
      "/media/albums/margherita/img_5.webp",
      "/media/albums/margherita/img_6.webp",
      "/media/albums/margherita/img_7.webp",
      "/media/albums/margherita/img_8.webp",
    ]
  },
  {
    id: "campolieto",
    title: "Villa Campolieto",
    subtitle: "Residenza Vesuviana — Ercolano",
    images: [
      "/media/albums/campolieto/img_14.webp",
      "/media/albums/campolieto/img_1.webp",
      "/media/albums/campolieto/img_2.webp",
      "/media/albums/campolieto/img_3.webp",
      "/media/albums/campolieto/img_4.webp",
      "/media/albums/campolieto/img_5.webp",
      "/media/albums/campolieto/img_6.webp",
      "/media/albums/campolieto/img_7.webp",
      "/media/albums/campolieto/img_8.webp",
      "/media/albums/campolieto/img_9.webp",
      "/media/albums/campolieto/img_10.webp",
      "/media/albums/campolieto/img_11.webp",

    ]
  }
];

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState(albumData[0].id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeAlbum = albumData.find(a => a.id === activeTab) || albumData[0];

  // We slice to a multiple of 3 (e.g. 6 or 9 or 12) to ensure 100% symmetric rows on desktop & tablet
  const displayImages = activeAlbum.images.slice(0, Math.floor(activeAlbum.images.length / 3) * 3 || 6);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % activeAlbum.images.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + activeAlbum.images.length) % activeAlbum.images.length);
    }
  };

  return (
    <section
      id="portfolio"
      data-theme="dark"
      className="relative text-[#FDFBF7] py-24 md:py-36 bg-[#2A2118] overflow-hidden"
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(circle at top, #4A3B32 0%, #2A2118 70%, #1A140E 100%)" }}
      />
      <div className="noise-bg opacity-10 z-0 relative" />

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16">
        
        {/* Section Intro */}
        <div className="mb-16 md:mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto"
          >
            <span className="label-caps mb-4 block text-[#B89768]">Portfolio Matrimoni</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.15] text-[#FDFBF7] mb-12">
              Spazi trasformati in <span className="italic font-light text-[#B89768]">emozione.</span>
            </h2>

            {/* Album Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 border-b border-[#FDFBF7]/10 pb-6">
              {albumData.map((album) => {
                const isActive = activeTab === album.id;
                return (
                  <button
                    key={album.id}
                    onClick={() => {
                      setActiveTab(album.id);
                      setLightboxIndex(null);
                    }}
                    className="relative pb-3 px-3 md:px-5 transition-colors duration-300 group"
                  >
                    <span
                      className={`font-sans tracking-[0.2em] uppercase text-xs md:text-sm transition-colors duration-300 ${
                        isActive ? "text-[#B89768] font-semibold" : "text-[#FDFBF7]/60 group-hover:text-[#FDFBF7]"
                      }`}
                    >
                      {album.title}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeAlbumTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B89768]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="font-serif italic text-sm md:text-base text-[#B89768]/80 mt-4">
              {activeAlbum.subtitle}
            </p>
          </motion.div>
        </div>

        {/* 100% Symmetrical Photo Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {displayImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.04 }}
                onClick={() => openLightbox(i)}
                className="relative cursor-pointer overflow-hidden photo-frame group aspect-[4/3] shadow-lg border border-[#B89768]/15"
              >
                <Image
                  src={src}
                  alt={`${activeAlbum.title} foto ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-sans uppercase text-[11px] tracking-[0.2em] text-[#FDFBF7] bg-[#1A140E]/85 px-4 py-2 border border-[#B89768]/40 shadow-xl">
                    Ingrandisci
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-16 md:mt-24 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-4 border border-[#B89768] text-[#FDFBF7] px-8 py-4 font-sans uppercase tracking-[0.2em] text-xs hover:bg-[#B89768] hover:text-[#1A140E] transition-all duration-500"
          >
            Richiedi Progetto Personalizzato
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white text-3xl font-light hover:text-[#B89768] transition-colors z-50 p-2"
              aria-label="Chiudi"
            >
              ✕
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 md:left-8 text-white text-3xl hover:text-[#B89768] transition-colors z-50 p-3 bg-black/40 rounded-full"
              aria-label="Foto precedente"
            >
              ‹
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 md:right-8 text-white text-3xl hover:text-[#B89768] transition-colors z-50 p-3 bg-black/40 rounded-full"
              aria-label="Foto successiva"
            >
              ›
            </button>

            {/* Full Image */}
            <div 
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeAlbum.images[lightboxIndex]}
                alt={activeAlbum.title}
                fill
                className="object-contain"
                quality={95}
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/75 text-[#FDFBF7] px-4 py-1 font-sans text-xs tracking-widest uppercase rounded-sm border border-[#B89768]/30">
                {activeAlbum.title} — {lightboxIndex + 1} / {activeAlbum.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
