"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 50) {
      setScrolled(true);
      if (latest > previous && latest > 150) {
        setHidden(true); // Nascondi quando scorri in giù
      } else {
        setHidden(false); // Mostra quando scorri in su
      }
    } else {
      setScrolled(false);
      setHidden(false);
    }
  });



  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed top-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? "glass-nav py-4" : "bg-transparent py-8"
      }`}
    >
      <h1 className="sr-only" style={{ color: '#4A3B32', backgroundColor: '#FDFBF7' }}>Sara D&apos;Angelo</h1>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <Image 
            src="/media/logo-transparent.png" 
            alt="Sara D'Angelo Logo" 
            width={300} 
            height={80} 
            className="h-12 w-auto md:h-14 lg:h-16 object-contain" 
            priority
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 uppercase tracking-[0.2em] text-xs font-sans font-medium transition-colors duration-500 text-[#4A3B32]">
          <a href="#hero" className="hover:text-[#B89768] transition-colors">Home</a>
          <a href="#metodo" className="hover:text-[#B89768] transition-colors">Il Metodo</a>
          <a href="#portfolio" className="hover:text-[#B89768] transition-colors">Portfolio</a>
          <a href="#social-proof" className="hover:text-[#B89768] transition-colors">Dicono di noi</a>
          <a href="#funnel" className="hover:text-[#B89768] transition-colors">Contatti</a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 focus:outline-none transition-colors duration-500 text-[#4A3B32]"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#B89768]/20 shadow-xl md:hidden"
          >
            <div className="flex flex-col items-center py-8 space-y-6 text-[#4A3B32] uppercase tracking-[0.2em] text-sm font-sans">
              <a href="#hero" onClick={() => setIsOpen(false)}>Home</a>
              <a href="#metodo" onClick={() => setIsOpen(false)}>Il Metodo</a>
              <a href="#portfolio" onClick={() => setIsOpen(false)}>Portfolio</a>
              <a href="#social-proof" onClick={() => setIsOpen(false)}>Recensioni</a>
              <a href="#funnel" onClick={() => setIsOpen(false)}>Contatti</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
