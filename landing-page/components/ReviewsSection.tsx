"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface GoogleReview {
  id: string;
  author: string;
  role: string;
  googleTag: string;
  isLocalGuide?: boolean;
  rating: number;
  date: string;
  leadQuote: string;
  fullQuote: string;
  imgSrc: string;
  weddingLocation?: string;
}

const googleReviews: GoogleReview[] = [
  {
    id: "cristiana",
    author: "Cristiana Longobardi",
    role: "Sposa",
    googleTag: "Recensione verificata Google",
    rating: 5,
    date: "Recensione recente",
    leadQuote: "«Non ci sono parole per ringraziare abbastanza Sara. Per noi è stata un vero e proprio angelo custode.»",
    fullQuote:
      "Dire che è una professionista eccezionale è riduttivo. Ha preso per mano i nostri sogni e li ha trasformati in realtà con dolcezza, pazienza e una passione che ci hanno fatto sentire speciali in ogni momento. Ha saputo ascoltarci anche nei momenti di stress, trasmettendoci una calma incredibile e curando ogni singolo aspetto come se stesse organizzando il matrimonio di una persona di famiglia. Il giorno delle nozze è stato una favola pura: tutto era perfetto, magico, oltre ogni nostra aspettativa. Più che una wedding planner, per noi è stata un'amica preziosa.",
    imgSrc: "/media/reviews/review_cristiana.webp",
    weddingLocation: "Napoli & Costiera",
  },
  {
    id: "umberto",
    author: "Umberto Del Piano",
    role: "Sposo",
    googleTag: "Recensione verificata Google",
    rating: 5,
    date: "Recensione recente",
    leadQuote: "«Sceglierla è stata una delle decisioni migliori del nostro matrimonio.»",
    fullQuote:
      "Fin dal primo momento ci ha messi completamente a nostro agio, ascoltandoci, accompagnandoci e condividendo con noi ogni aspetto del matrimonio. Una professionista straordinaria, capace di darci sempre il consiglio giusto e di trasformare le nostre e le sue idee in un evento fantastico. Ma ciò che la rende davvero speciale è la sua capacità di entrare in sintonia con gli sposi, con empatia, disponibilità e passione.",
    imgSrc: "/media/reviews/review_umberto.webp",
    weddingLocation: "Campania Felix",
  },
  {
    id: "cristina",
    author: "Cristina Porcella",
    role: "Google Local Guide",
    googleTag: "Local Guide · 14 recensioni",
    isLocalGuide: true,
    rating: 5,
    date: "Recensione verificata",
    leadQuote: "«Bravissima: mette tutto il suo amore e la sua professionalità negli eventi che realizza.»",
    fullQuote:
      "Mette tutto il suo amore, la sua dedizione e la sua autentica professionalità architettonica negli eventi che realizza. La consiglio con il cuore a chi desidera un matrimonio impeccabile, curato con assoluto rigore e calore umano.",
    imgSrc: "/media/reviews/review_cristina.webp",
    weddingLocation: "Golfo di Napoli",
  },
  {
    id: "giuseppe",
    author: "Giuseppe Silvestri",
    role: "Google Local Guide",
    googleTag: "Local Guide · 42 recensioni",
    isLocalGuide: true,
    rating: 5,
    date: "Recensione verificata",
    leadQuote: "«Semplicemente la numero 1!»",
    fullQuote:
      "Semplicemente la numero 1! Professionalità d'altissimo livello, visione estetica superiore e presenza rassicurante e impeccabile in ogni fase dell'evento.",
    imgSrc: "/media/reviews/review_3.webp",
    weddingLocation: "Ville Vesuviane",
  },
];

const GOOGLE_MAPS_PROFILE_URL = "https://share.google/IGfFoBWOhEzapoZCu";

function GoogleColorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % googleReviews.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextReview = () => {
    setCurrent((prev) => (prev + 1) % googleReviews.length);
  };

  const prevReview = () => {
    setCurrent((prev) => (prev - 1 + googleReviews.length) % googleReviews.length);
  };

  const active = googleReviews[current];

  return (
    <section
      id="social-proof"
      className="relative py-20 md:py-28 lg:py-36 bg-[#FDFBF7] overflow-hidden border-t border-[#4A3B32]/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#B89768_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-16">
        
        {/* Header with Google My Business Trust Card */}
        <div className="mb-14 md:mb-20 pb-8 border-b border-[#4A3B32]/10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B89768]/10 text-[#B89768] text-xs font-sans tracking-[0.2em] uppercase font-semibold mb-4">
              <GoogleColorIcon className="w-3.5 h-3.5" />
              <span>Dicono di me</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4A3B32] font-normal tracking-tight">
              Esperienze autentiche, <br className="hidden md:block" />
              <span className="italic text-[#B89768]">verificate su Google.</span>
            </h2>
          </div>

          {/* Google Official Rating Badge */}
          <a
            href={GOOGLE_MAPS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apri la scheda Google di Sara D'Angelo (apre una nuova scheda)"
            className="group inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm border border-[#4A3B32]/15 px-5 py-3.5 rounded-2xl shadow-[0_8px_30px_rgba(74,59,50,0.06)] hover:border-[#B89768] hover:shadow-[0_12px_35px_rgba(184,151,104,0.18)] transition-all duration-300 self-start lg:self-auto"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] flex items-center justify-center shadow-inner shrink-0">
              <GoogleColorIcon className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-[#1A140E] text-lg leading-none">5.0</span>
                <div className="flex text-[#B89768]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B89768] text-[#B89768]" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4A3B32]/70 font-sans mt-1">
                <span>Scheda Ufficiale Google</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#B89768]" />
                <span className="text-[#B89768] font-medium group-hover:underline flex items-center gap-0.5">
                  Verifica profilo <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Main Showcase: Split Layout (Editorial Photo + Google Review Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Photo Frame */}
          <div className="lg:col-span-5 relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-2xl shadow-2xl overflow-hidden border border-[#4A3B32]/10 bg-[#FAF7F2]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={active.imgSrc}
                  alt={`Matrimonio firmato Sara D'Angelo - ${active.author}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A140E]/60 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[#FDFBF7]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89768] font-semibold block">
                      Location Evento
                    </span>
                    <span className="font-serif italic text-lg text-[#FDFBF7]">
                      {active.weddingLocation}
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 font-sans tracking-wider uppercase text-[10px]">
                    Progetto Sartoriale
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Authentic Google Review Card */}
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            {/* Elegant Background Watermark Quote */}
            <div className="absolute -top-16 -left-6 md:-left-12 text-[10rem] md:text-[14rem] font-serif italic text-[#B89768]/[0.06] leading-none pointer-events-none select-none z-0">
              &ldquo;
            </div>

            <div className="relative z-10 bg-white/85 backdrop-blur-sm border border-[#4A3B32]/10 rounded-3xl p-7 md:p-10 lg:p-12 shadow-[0_10px_40px_rgba(74,59,50,0.05)]">
              
              {/* Reviewer Header with Google Identifier */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#4A3B32]/10 mb-8">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B89768] to-[#8C6D40] text-white font-serif italic text-xl flex items-center justify-center shadow-md shrink-0">
                    {active.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-semibold text-[#1A140E] text-base md:text-lg">
                        {active.author}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" aria-label="Verificato" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#4A3B32]/70 font-sans">
                      <span className="font-medium text-[#B89768]">{active.role}</span>
                      <span>•</span>
                      <span>{active.googleTag}</span>
                    </div>
                  </div>
                </div>

                {/* Stars + Google Brand Pill */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex text-[#B89768]">
                    {[...Array(active.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#B89768] text-[#B89768]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4A3B32]/60 font-sans">
                    <GoogleColorIcon className="w-3.5 h-3.5" />
                    Google Maps
                  </span>
                </div>
              </div>

              {/* Dynamic Review Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-serif italic text-xl md:text-2xl lg:text-3xl text-[#4A3B32] leading-snug mb-6">
                    {active.leadQuote}
                  </p>

                  <p className="font-sans font-light text-[#4A3B32]/85 text-sm md:text-base leading-relaxed mb-8">
                    {active.fullQuote}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Card Footer: Navigation & Direct Link */}
              <div className="pt-6 border-t border-[#4A3B32]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={GOOGLE_MAPS_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-sans font-semibold text-[#B89768] hover:text-[#4A3B32] transition-colors"
                >
                  <GoogleColorIcon className="w-4 h-4" />
                  <span>Leggi su Google My Business</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Arrows */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={prevReview}
                    aria-label="Recensione precedente"
                    className="w-10 h-10 rounded-full border border-[#4A3B32]/20 flex items-center justify-center text-[#4A3B32] hover:bg-[#B89768] hover:text-[#1A140E] hover:border-[#B89768] transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextReview}
                    aria-label="Prossima recensione"
                    className="w-10 h-10 rounded-full border border-[#4A3B32]/20 flex items-center justify-center text-[#4A3B32] hover:bg-[#B89768] hover:text-[#1A140E] hover:border-[#B89768] transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Interactive Review Switcher Strip (All 4 Google Reviews) */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {googleReviews.map((rev, idx) => {
            const isSelected = idx === current;
            return (
              <button
                key={rev.id}
                onClick={() => setCurrent(idx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-[#B89768] shadow-[0_10px_25px_rgba(184,151,104,0.15)] ring-1 ring-[#B89768]"
                    : "bg-white/60 border-[#4A3B32]/10 hover:bg-white hover:border-[#4A3B32]/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-[#B89768]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#B89768] text-[#B89768]" />
                      ))}
                    </div>
                    <GoogleColorIcon className="w-3.5 h-3.5 opacity-70" />
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-[#1A140E] truncate">
                    {rev.author}
                  </h4>
                  <p className="font-serif italic text-xs text-[#4A3B32]/70 line-clamp-2 mt-1">
                    {rev.leadQuote.replace(/[«»]/g, '"')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#4A3B32]/10 flex items-center justify-between text-[11px] text-[#4A3B32]/60">
                  <span className="font-medium text-[#B89768]">{rev.role}</span>
                  <span className="text-[10px] uppercase tracking-wider">{rev.date}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Call to Action for Google Profile */}
        <div className="mt-12 text-center">
          <p className="text-xs md:text-sm text-[#4A3B32]/70 font-sans">
            Tutte le recensioni sono autentiche e consultabili pubblicamente su{" "}
            <a
              href={GOOGLE_MAPS_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B89768] font-medium underline underline-offset-4 hover:text-[#1A140E] transition-colors"
            >
              Google Maps & Google My Business
            </a>
            .
          </p>
        </div>

      </div>
    </section>
  );
}
