# Analysis: Milestone 1 Design & Implementation Plan

## Overview
This document outlines the changes required to implement Milestone 1 (Global Setup & Hero) according to the strict High Fashion / Vogue design guidelines, ensuring the removal of all black and dark gray colors, and introducing highly emotional, editorial copywriting.

## 1. Palette Enforcement
The project scope explicitly prohibits pure black and dark mode. The foreground color must be the warm brown `#4A3B32` replacing `#2A2A2A`.

### Findings:
- `app/globals.css`: Contains `--foreground: #2A2A2A;` (lines 5 and 23).
- `app/layout.tsx`: Contains `text-[#2A2A2A]` (line 54).
- `components/Navbar.tsx`: Uses `text-[#2A2A2A]` for text colors when scrolled (lines 42, 48, 60, 82).
- `components/HeroSection.tsx`: Uses `bg-black`, `bg-black/40`, `bg-black/20`, and `rgba(0,0,0,0.65)` (lines 23, 36, 37, 52).

### Proposed Action:
1. In `app/globals.css`, change `--foreground: #2A2A2A;` to `--foreground: #4A3B32;`.
2. In `app/layout.tsx`, change `text-[#2A2A2A]` to `text-[#4A3B32]`.
3. In `components/Navbar.tsx`, change all occurrences of `text-[#2A2A2A]` to `text-[#4A3B32]`.
4. In `components/HeroSection.tsx`:
   - Replace `bg-black` with `bg-[#4A3B32]` (or a deeper shade if required by contrast, but keeping the hue, e.g., `#2C221C`, but ideally stick to `#4A3B32`). Let's use `bg-[#4A3B32]`.
   - Replace `bg-black/40` with `bg-[#4A3B32]/50` for overlays.
   - Replace `bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.65)_0%,_rgba(0,0,0,0)_70%)]` with `bg-[radial-gradient(ellipse_at_center,_rgba(74,59,50,0.65)_0%,_rgba(74,59,50,0)_70%)]` (where 74, 59, 50 is the RGB for #4A3B32).
   - Replace `bg-black/20` with `bg-[#4A3B32]/30`.

## 2. Typography & Copywriting (Hero Section)
The High Fashion aesthetic requires immense negative space, huge serif titles, and tiny sans uppercase details. The current copy is slightly corporate ("Luxury Wedding Architecture", "18 anni di eccellenza. Nessun imprevisto..."). We need a more poetic, emotional approach ("scrollytelling emozionale").

### Suggested Copy & Typography Application:

**1. Top Label (Tiny Sans Uppercase):**
- *Before:* Luxury Wedding Architecture
- *After:* L'ESCLUSIVITÀ DI UN ATTIMO IMPERFETTIBILE
- *Style:* `font-sans tracking-[0.4em] uppercase text-[10px]`

**2. Main Headline (Huge Serif):**
- *Before:* L'Arte della / Celebrazione.
- *After:* La Bellezza / Senza Tempo.
- *Style:* `font-serif text-[#FDFBF7] text-5xl md:text-7xl lg:text-[6rem] leading-[1.1]`

**3. Sub-Headline (Huge Serif Italic, Gold):**
- *Before:* Progettata su misura.
- *After:* L'emozione fatta forma.
- *Style:* `italic font-light text-[#D4AF37] text-4xl md:text-6xl lg:text-7xl`

**4. Paragraph (Sans, Light, Spaced):**
- *Before:* 18 anni di eccellenza. Nessun imprevisto, solo la perfezione scenografica che il tuo giorno merita.
- *After:* La quintessenza dell'eleganza sartoriale. 18 anni di regia per matrimoni dove ogni dettaglio respira lusso, autenticità e puro incanto.
- *Style:* `text-[#FDFBF7] font-sans font-light tracking-widest text-base md:text-lg max-w-2xl`

**5. CTA Button (Tiny Sans Uppercase):**
- *Before:* Inizia il Progetto
- *After:* SCOPRI LA NOSTRA VISIONE
- *Style:* `font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase`

### Refined Navbar:
To match the Hero, the Navbar items and logo should also exude that Vogue feel. The current font choices are good (`font-serif` for logo, `font-sans` for links), just ensure colors are updated to `#4A3B32` as per palette.

## 3. Implementation Steps for Implementer
1. Update CSS variables in `app/globals.css`.
2. Update body classes in `app/layout.tsx`.
3. Update `text-[#2A2A2A]` to `text-[#4A3B32]` in `components/Navbar.tsx`.
4. Overhaul `components/HeroSection.tsx`:
   - Inject the new copy.
   - Replace all `black` color utility classes with `#4A3B32` equivalents.
   - Adjust typography sizes if necessary to maximize the "Huge Serif / Tiny Sans" contrast.
