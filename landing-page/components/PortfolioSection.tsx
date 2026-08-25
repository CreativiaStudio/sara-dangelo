"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import manifest from "@/public/media/albums/manifest.json";
import PortfolioSwitcher, { WeddingAlbumSummary } from "@/components/PortfolioSwitcher";

interface AlbumItem {
  src: string;
  width: number;
  height: number;
  isVertical: boolean;
  aspectRatio: number;
  originalName: string;
}

interface ManifestEntry {
  title: string;
  subtitle: string;
  images: AlbumItem[];
}

type ManifestData = Record<string, ManifestEntry>;

const albumKeys = Object.keys(manifest) as Array<keyof ManifestData>;

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<string>(albumKeys[0] || "capri");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const stickySwitcherRef = useRef<HTMLDivElement>(null);
  const photoGridRef = useRef<HTMLDivElement>(null);

  const manifestData = manifest as unknown as ManifestData;
  const currentAlbumData = manifestData[activeTab] || manifestData[albumKeys[0]];
  const activeImages: AlbumItem[] = currentAlbumData?.images || [];

  const albumSummaries: WeddingAlbumSummary[] = albumKeys.map((key) => {
    const album = manifestData[key];
    return {
      key,
      title: album.title,
      subtitle: album.subtitle,
      count: album.images.length,
    };
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % activeImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + activeImages.length) % activeImages.length);
    }
  };

  const handleSelectWedding = (key: string) => {
    // 1. Instantly switch dataset in state
    setActiveTab(key);
    setLightboxIndex(null);

    // 2. Concurrently auto-scroll to the top of the photo grid
    if (typeof window !== "undefined") {
      const gridEl = document.getElementById("portfolio-gallery-grid") || photoGridRef.current;
      if (gridEl) {
        const rect = gridEl.getBoundingClientRect();
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Sticky Switcher (~64px) + buffer (~20px) = ~84px clearance (navbar is hidden during portfolio browsing)
        const switcherEl = stickySwitcherRef.current;
        const switcherHeight = switcherEl ? switcherEl.offsetHeight : 64;
        const buffer = 20;
        const totalOffset = switcherHeight + buffer;

        const targetY = rect.top + currentScroll - totalOffset;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section
      id="portfolio"
      data-theme="dark"
      className="relative text-[#FDFBF7] py-24 md:py-36 bg-[#2A2118] overflow-x-clip"
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at top, #4A3B32 0%, #2A2118 70%, #1A140E 100%)" }}
      />
      <div className="noise-bg opacity-10 z-0 relative pointer-events-none" />

      {/* Section Intro Header */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16 mb-12 md:mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl mx-auto"
        >
          <span className="label-caps mb-4 block text-[#B89768]">Portfolio Matrimoni</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.15] text-[#FDFBF7] mb-6">
            Spazi trasformati in <span className="italic font-light text-[#B89768]">emozione.</span>
          </h2>
          <p className="font-serif italic text-sm md:text-base text-[#B89768]/90 max-w-2xl mx-auto">
            {currentAlbumData?.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Sticky / Floating Contextual Wedding Switcher Bar (R1, R3, R4) */}
      <PortfolioSwitcher
        albums={albumSummaries}
        activeTab={activeTab}
        onSelectWedding={handleSelectWedding}
        stickyRef={stickySwitcherRef}
      />

      {/* Gallery & Photo Grid Container */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16 mt-10 md:mt-12">
        <div
          id="portfolio-gallery-grid"
          ref={photoGridRef}
          className="scroll-mt-40 focus:outline-none"
        >
          {/* Symmetrical Luxury Grid Gallery with Instant Cross-Fade (R2) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {activeImages.map((img, i) => {
                const mobileAspectRatio =
                  img.width && img.height
                    ? `${img.width} / ${img.height}`
                    : img.isVertical
                    ? "4/5"
                    : "3/2";

                return (
                  <motion.div
                    key={img.src}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.025, 0.15) }}
                    onClick={() => openLightbox(i)}
                    style={{ aspectRatio: mobileAspectRatio }}
                    className="relative cursor-pointer overflow-hidden photo-frame group sm:!aspect-[4/5] shadow-lg border border-[#B89768]/20 bg-[#1A140E] w-full"
                  >
                    <Image
                      src={img.src}
                      alt={`${currentAlbumData.title} foto ${i + 1}`}
                      fill
                      priority={i === 0}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="font-sans uppercase text-[11px] tracking-[0.2em] text-[#FDFBF7] bg-[#1A140E]/85 px-4 py-2 border border-[#B89768]/40 shadow-xl">
                        Ingrandisci #{i + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Call To Action */}
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

      {/* Fullscreen Lightbox Modal (Elevated z-index z-[60] above navbar & sticky bar) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
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

            {/* Full Uncropped Image */}
            <div
              className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImages[lightboxIndex]?.src}
                alt={currentAlbumData.title}
                fill
                className="object-contain"
                quality={95}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-[#FDFBF7] px-4 py-2 font-sans text-xs tracking-widest uppercase rounded-sm border border-[#B89768]/30">
                {currentAlbumData.title} — {lightboxIndex + 1} / {activeImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
