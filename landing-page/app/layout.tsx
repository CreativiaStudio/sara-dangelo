import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Sara D'Angelo | Wedding Architect — Napoli",
  description:
    "Matrimoni d'autore nella Costiera Amalfitana e in Campania. Sara D'Angelo progetta esperienze irripetibili dove ogni dettaglio diventa emozione.",
  keywords: "wedding planner napoli, matrimoni di lusso campania, wedding architect, sara d'angelo, costiera amalfitana",
  openGraph: {
    title: "Sara D'Angelo | Wedding Architect — Napoli",
    description:
      "Matrimoni d'autore nella Costiera Amalfitana e in Campania. Ogni dettaglio diventa emozione.",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${playfair.variable} ${cormorant.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FDFBF7] text-[#4A3B32]">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
