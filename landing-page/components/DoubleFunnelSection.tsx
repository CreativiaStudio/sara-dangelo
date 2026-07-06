"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

type TierId = "free" | "tier1" | "tier2" | "tier3";

const TIERS = [
  { 
    id: "free", 
    name: "Call Conoscitiva", 
    price: 0, 
    desc: "Parliamo del vostro sogno per scoprire se c'è sintonia per un percorso insieme." 
  },
  { 
    id: "tier1", 
    name: "Consulenza Location", 
    price: 100, 
    desc: "Supporto strategico e analisi per individuare la location perfetta per voi." 
  },
  { 
    id: "tier2", 
    name: "Location + Sopralluogo", 
    price: 250, 
    desc: "Ricerca location con sopralluogo tecnico di persona per valutare spazi e logistica." 
  },
  { 
    id: "tier3", 
    name: "Consulenza Progetto", 
    price: 500, 
    desc: "Sviluppo di un progetto preliminare completo di scenografia, mood e palette." 
  },
];

export default function DoubleFunnelSection() {
  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactDate, setContactDate] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [contactGuests, setContactGuests] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedTier, setSelectedTier] = useState<TierId>("free");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactStatus === "loading") return;
    if (!contactName.trim() || !contactEmail.trim() || !contactEmail.includes("@")) {
      setContactStatus("error");
      return;
    }

    setContactStatus("loading");
    
    const activeTier = TIERS.find(t => t.id === selectedTier)!;

    try {
      if (selectedTier === "free") {
        const res = await fetch("/api/supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: contactEmail,
            name: contactName,
            phone: contactPhone,
            date: contactDate,
            location: contactLocation,
            guests: contactGuests,
            message: contactMessage,
            type: "consultation_free",
          }),
        });
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (res.ok) setContactStatus("success");
        else setContactStatus("error");
      } else {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: contactEmail,
            name: contactName,
            phone: contactPhone,
            date: contactDate,
            location: contactLocation,
            guests: contactGuests,
            message: contactMessage,
            tier: activeTier.id,
            tierName: activeTier.name,
            tierPrice: activeTier.price
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setContactStatus("error");
        }
      }
    } catch {
      setContactStatus("error");
    }
  };

  const isFree = selectedTier === "free";

  return (
    <div id="contact">
      <section id="funnel" data-theme="dark" className="w-full relative overflow-hidden">
        {/* Background Image — subtle */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/bellevue-setup.webp"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            quality={60}
          />
          <div className="absolute inset-0 bg-[#2A2118]/85" />
        </div>

        <div className="relative z-10 max-w-[90rem] mx-auto px-4 lg:px-16 py-28 md:py-40">
          {/* Section intro */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="font-sans text-[11px] md:text-xs tracking-[0.35em] uppercase text-[#B89768] mb-6 block">Il Primo Passo</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tight text-[#FDFBF7]">
              Iniziamo a{" "}
              <span className="italic font-light text-[#B89768]">sognare.</span>
            </h2>
          </motion.div>

          {/* Centered Form Area */}
          <div className="flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl bg-[#FDFBF7] p-6 md:p-14 shadow-2xl border border-[#B89768]/50"
              data-theme="light"
            >
              <div className="w-full mx-auto">
                <div className="text-center mb-10">
                  <span className="label-caps mb-4 block mx-auto">Consulenza su Misura</span>
                  <h3 className="text-3xl md:text-4xl font-serif text-[#4A3B32] mb-6 leading-[1.2]">
                    Scegli il Tuo Percorso
                  </h3>
                  <div className="editorial-line mx-auto mb-6" />
                  <p className="text-[#4A3B32]/90 font-sans font-normal leading-[1.8] text-sm md:text-base max-w-2xl mx-auto">
                    Ogni progetto è unico. Seleziona il livello di consulenza più adatto alle tue esigenze attuali, poi raccontami la tua visione.
                  </p>
                </div>

                {contactStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#F5EFE6] text-[#4A3B32] p-8 text-center border border-[#B89768]/20 max-w-2xl mx-auto mt-8"
                  >
                    <p className="font-serif italic text-xl mb-2">
                      Grazie, {contactName}.
                    </p>
                    <p className="font-sans text-sm font-light text-[#4A3B32]/70">
                      Ho ricevuto la vostra richiesta. Vi ricontatterò al più presto per il prossimo passo.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-10">
                    
                    {/* Tiers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {TIERS.map(tier => {
                        const isSelected = selectedTier === tier.id;
                        return (
                          <div 
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id as TierId)}
                            className={`relative cursor-pointer p-6 border transition-all duration-500 group flex flex-col justify-between ${
                              isSelected 
                                ? "border-[#B89768] bg-[#B89768]/5 shadow-inner" 
                                : "border-[#4A3B32]/15 hover:border-[#B89768]/50 hover:bg-[#F5EFE6]/50"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <h4 className={`font-serif text-xl ${isSelected ? "text-[#B89768]" : "text-[#4A3B32]"}`}>
                                  {tier.name}
                                </h4>
                                {isSelected && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <Check className="w-5 h-5 text-[#B89768]" strokeWidth={1.5} />
                                  </motion.div>
                                )}
                              </div>
                              <p className="text-[#4A3B32]/70 font-sans text-xs leading-relaxed">
                                {tier.desc}
                              </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-[#4A3B32]/10 flex justify-between items-end">
                              <span className="text-[10px] tracking-widest uppercase text-[#4A3B32]/50">
                                Investimento
                              </span>
                              <span className={`font-serif text-lg ${isSelected ? "text-[#B89768]" : "text-[#4A3B32]"}`}>
                                {tier.price === 0 ? "Gratuito" : `€${tier.price}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-6 mt-4">
                      <div className="text-center mb-2">
                        <h4 className="font-serif text-2xl text-[#4A3B32]">I Vostri Dettagli</h4>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Nomi degli Sposi"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50"
                      />
                      <div className="flex flex-col sm:flex-row gap-6">
                        <input
                          type="email"
                          placeholder="Email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
                          className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50"
                        />
                        <input
                          type="tel"
                          placeholder="Telefono"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          required
                          className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <input
                          type="text"
                          placeholder="Data indicativa"
                          value={contactDate}
                          onChange={(e) => setContactDate(e.target.value)}
                          className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50"
                        />
                        <input
                          type="number"
                          placeholder="N° Invitati (circa)"
                          value={contactGuests}
                          onChange={(e) => setContactGuests(e.target.value)}
                          className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Avete già una location o una zona in mente?"
                        value={contactLocation}
                        onChange={(e) => setContactLocation(e.target.value)}
                        className="w-full bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50"
                      />
                      <textarea
                        placeholder="Raccontami il tuo sogno. Come immaginate l'atmosfera del vostro grande giorno? Qual è il dettaglio che non deve assolutamente mancare?"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans font-normal text-sm focus:outline-none focus:border-[#B89768] transition-colors duration-500 placeholder:text-[#4A3B32]/50 resize-none"
                      />
                      
                      <button
                        type="submit"
                        disabled={contactStatus === "loading"}
                        className="mt-6 w-full bg-[#B89768] text-[#FDFBF7] font-sans uppercase tracking-[0.25em] text-[11px] py-5 hover:bg-[#4A3B32] disabled:opacity-50 transition-all duration-700 flex justify-center items-center gap-3"
                      >
                        {contactStatus === "loading"
                          ? "Attendere prego..."
                          : isFree ? "Richiedi Incontro Gratuito" : "Procedi al Pagamento"}
                      </button>
                      
                      {contactStatus === "error" && (
                        <p
                          className="text-[#B5952F] text-xs mt-1 text-center"
                          role="alert"
                        >
                          Si è verificato un errore. Riprova.
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-[#B89768]/10 py-10">
          <div className="max-w-[90rem] mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-lg text-[#FDFBF7]/60 tracking-wide">
              Sara D&apos;Angelo
            </p>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/40">
              Wedding Architect — Napoli & Costiera Amalfitana
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
