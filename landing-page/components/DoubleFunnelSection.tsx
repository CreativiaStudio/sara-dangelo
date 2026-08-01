"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DoubleFunnelSection() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactDate, setContactDate] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [contactGuests, setContactGuests] = useState("");
  const [contactBudget, setContactBudget] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactStatus === "loading") return;
    if (!contactName.trim() || !contactEmail.trim() || !contactEmail.includes("@") || !privacyAccepted) {
      setContactStatus("error");
      return;
    }

    setContactStatus("loading");

    try {
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
          budget: contactBudget,
          message: contactMessage,
          privacyAccepted,
          type: "consultation_free",
        }),
      });

      await new Promise((resolve) => setTimeout(resolve, 800));
      if (res.ok) {
        setContactStatus("success");
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
  };

  return (
    <div id="contact">
      <section id="funnel" data-theme="dark" className="w-full relative overflow-hidden bg-[#2A2118]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/bellevue-setup.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            quality={60}
          />
          <div className="absolute inset-0 bg-[#2A2118]/85" />
        </div>

        <div className="relative z-10 max-w-[90rem] mx-auto px-4 lg:px-16 py-28 md:py-40">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="font-sans text-xs tracking-[0.35em] uppercase text-[#B89768] mb-4 block">
              Consulenza Conoscitiva (30 Minuti)
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tight text-[#FDFBF7]">
              Iniziamo a <span className="italic font-light text-[#B89768]">progettare insieme.</span>
            </h2>
          </motion.div>

          {/* Form Card */}
          <div className="flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl bg-[#FDFBF7] p-8 md:p-14 shadow-2xl border border-[#B89768]/40"
              data-theme="light"
            >
              <div className="w-full mx-auto">
                <div className="text-center mb-10">
                  <span className="label-caps mb-3 block mx-auto text-[#B89768]">Un Percorso Esclusivo</span>
                  <h3 className="text-2xl md:text-4xl font-serif text-[#4A3B32] mb-4">
                    Richiedi la tua Call conoscitiva
                  </h3>
                  <div className="editorial-line mx-auto mb-6" />
                  
                  {/* Soft & Warm Selection Note */}
                  <div className="bg-[#F5EFE6] border border-[#B89768]/30 p-5 md:p-7 mb-8 text-left rounded-sm">
                    <p className="text-xs md:text-sm font-sans font-light leading-relaxed text-[#4A3B32]/90 italic">
                      <strong className="font-semibold text-[#4A3B32] not-italic block mb-1">Nota di Cura & Esclusività:</strong>
                      Per garantire a ciascuna coppia una presenza totale, uno studio sartoriale e la massima cura dei dettagli, accetto solo un numero limitato di matrimoni ogni anno. Leggerò con attenzione le vostre informazioni per verificare l&apos;armonia del progetto e vi ricontatterò personalmente per fissare la nostra chiamata.
                    </p>
                  </div>
                </div>

                {contactStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#F5EFE6] text-[#4A3B32] p-8 text-center border border-[#B89768]/40 max-w-xl mx-auto my-6"
                  >
                    <p className="font-serif italic text-2xl text-[#B89768] mb-3">
                      Grazie, {contactName}!
                    </p>
                    <p className="font-sans text-sm font-light text-[#4A3B32]/80 leading-relaxed">
                      Ho ricevuto la vostra richiesta. Leggerò con cura i vostri dettagli e vi ricontatterò al più presto per il nostro appuntamento conoscitivo.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                    <input
                      type="text"
                      placeholder="Nomi degli Sposi *"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                    />

                    <div className="flex flex-col sm:flex-row gap-6">
                      <input
                        type="email"
                        placeholder="Email *"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                      />
                      <input
                        type="tel"
                        placeholder="Telefono / WhatsApp *"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                        className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <input
                        type="text"
                        placeholder="Data dell'evento (es. Giugno 2027)"
                        value={contactDate}
                        onChange={(e) => setContactDate(e.target.value)}
                        className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                      />
                      <input
                        type="text"
                        placeholder="N° Invitati indicativo (es. 100-120)"
                        value={contactGuests}
                        onChange={(e) => setContactGuests(e.target.value)}
                        className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <input
                        type="text"
                        placeholder="Location o zona desiderata (es. Capri, Ravello...)"
                        value={contactLocation}
                        onChange={(e) => setContactLocation(e.target.value)}
                        className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                      />
                      <input
                        type="text"
                        placeholder="Budget indicativo di riferimento"
                        value={contactBudget}
                        onChange={(e) => setContactBudget(e.target.value)}
                        className="w-full sm:w-1/2 bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50"
                      />
                    </div>

                    <textarea
                      placeholder="Raccontatemi la vostra idea o la vostra visione del matrimonio..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border-b border-[#4A3B32]/30 py-3 text-[#4A3B32] font-sans text-sm focus:outline-none focus:border-[#B89768] transition-colors placeholder:text-[#4A3B32]/50 resize-none"
                    />

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-start gap-3 mt-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4 rounded border-[#4A3B32]/30 text-[#B89768] focus:ring-[#B89768] accent-[#B89768] cursor-pointer"
                      />
                      <label htmlFor="privacy" className="text-xs font-sans font-light text-[#4A3B32]/80 leading-relaxed cursor-pointer select-none">
                        Ho letto e accetto l&apos;informativa sulla <span className="underline font-normal text-[#4A3B32]">Privacy Policy</span> per il trattamento dei dati personali. *
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={contactStatus === "loading"}
                      className="mt-4 w-full bg-[#B89768] text-[#FDFBF7] font-sans uppercase tracking-[0.25em] text-xs font-semibold py-5 hover:bg-[#4A3B32] hover:text-[#FDFBF7] disabled:opacity-50 transition-all duration-500 shadow-md"
                    >
                      {contactStatus === "loading"
                        ? "Invio in corso..."
                        : "Invia Richiesta per la Consulenza Conoscitiva"}
                    </button>

                    {contactStatus === "error" && (
                      <p className="text-red-700 text-xs mt-2 text-center" role="alert">
                        Si è verificato un errore. Assicurati di aver accettato la Privacy Policy e inserito email e nome validi.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-[#B89768]/15 py-10">
          <div className="max-w-[90rem] mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-lg text-[#FDFBF7]/80 tracking-wide">
              Sara D&apos;Angelo
            </p>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/50">
              Wedding Architect — Napoli, Costiera, Capri & Italia
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
