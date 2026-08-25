"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface WeddingAlbumSummary {
  key: string;
  title: string;
  subtitle?: string;
  count: number;
}

interface PortfolioSwitcherProps {
  albums: WeddingAlbumSummary[];
  activeTab: string;
  onSelectWedding: (key: string) => void;
  stickyRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PortfolioSwitcher({
  albums,
  activeTab,
  onSelectWedding,
  stickyRef,
}: PortfolioSwitcherProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Center active pill in mobile scroll container
  useEffect(() => {
    const activeEl = pillRefs.current[activeTab];
    if (activeEl && scrollContainerRef.current) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  // Gentle, ultra-slow auto-drift on mobile when idle to visually hint more albums
  useEffect(() => {
    let animId: number;
    let pauseTimer: NodeJS.Timeout;
    let isUserInteracting = false;
    const container = scrollContainerRef.current;

    if (!container || typeof window === "undefined") return;

    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    const handleUserInteraction = () => {
      isUserInteracting = true;
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        isUserInteracting = false;
      }, 3500); // Resume slow drift 3.5s after user touches or scrolls
    };

    container.addEventListener("touchstart", handleUserInteraction, { passive: true });
    container.addEventListener("touchmove", handleUserInteraction, { passive: true });
    container.addEventListener("pointerdown", handleUserInteraction, { passive: true });
    container.addEventListener("wheel", handleUserInteraction, { passive: true });

    let direction = 1; // 1 = forward, -1 = backward
    const speed = 0.35; // Ultra slow: 0.35px per frame (~20px per sec)

    const step = () => {
      if (!isUserInteracting && container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 10) {
          if (container.scrollLeft >= maxScroll - 1) {
            direction = -1;
          } else if (container.scrollLeft <= 1) {
            direction = 1;
          }
          container.scrollLeft += speed * direction;
        }
      }
      animId = requestAnimationFrame(step);
    };

    const startTimeout = setTimeout(() => {
      animId = requestAnimationFrame(step);
    }, 1500);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(pauseTimer);
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener("touchstart", handleUserInteraction);
        container.removeEventListener("touchmove", handleUserInteraction);
        container.removeEventListener("pointerdown", handleUserInteraction);
        container.removeEventListener("wheel", handleUserInteraction);
      }
    };
  }, []);

  return (
    <div
      ref={stickyRef}
      className="sticky top-0 z-40 w-full py-3 md:py-4 bg-[#2A2118]/95 backdrop-blur-md border-y border-[#B89768]/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300"
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Soft edge fade cues for mobile & tablet horizontal scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#2A2118] to-transparent pointer-events-none z-10 xl:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#2A2118] to-transparent pointer-events-none z-10 xl:hidden" />

        {/* Scrollable / Centered Pill Bar */}
        <div
          ref={scrollContainerRef}
          className="flex items-center xl:justify-center gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-6 py-1"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x proximity",
            scrollPaddingInline: "1.5rem",
          }}
          role="tablist"
          aria-label="Portfolio Matrimoni"
        >
          {albums.map((album) => {
            const isActive = activeTab === album.key;

            return (
              <button
                key={album.key}
                ref={(el) => {
                  pillRefs.current[album.key] = el;
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls="portfolio-gallery-grid"
                onClick={() => onSelectWedding(album.key)}
                className={`relative flex-shrink-0 min-h-[44px] px-4 md:px-5 py-2.5 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer select-none group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] ${
                  isActive ? "text-[#B89768]" : "text-[#FDFBF7]/70 hover:text-[#FDFBF7]"
                }`}
                style={{ scrollSnapAlign: "center" }}
              >
                <span className="font-sans uppercase text-xs tracking-[0.18em] font-medium transition-colors duration-300">
                  {album.title}
                </span>

                {/* Animated active pill background */}
                {isActive && (
                  <motion.div
                    layoutId="activeStickyPill"
                    className="absolute inset-0 bg-[#B89768]/15 border border-[#B89768] rounded-full -z-10 shadow-[0_0_15px_rgba(184,151,104,0.25)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
