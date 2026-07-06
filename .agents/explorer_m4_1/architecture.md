# Architecture & Implementation Strategy for Milestone 4

## 1. Global Setup (Layout & Styles)
**File**: `app/layout.tsx`
- Replace `Geist` fonts with Google Fonts: `Playfair_Display` (for serif titles) and `Montserrat` (for clean sans-serif text).
- Update `<html className="...">` to inject these font variables.
- Update `metadata` with title: "Sara D'Angelo - Architetto del Matrimonio" and an elegant description.

**File**: `app/globals.css`
- Integrate the required 'editoriale' palette using Tailwind v4 `@theme` syntax or CSS variables:
  - Background (crema/panna): `#FDFBF7` or `#F8F5F0`
  - Accents (oro/bronzo): `#D4AF37` / `#CD7F32`
  - Text: Dark charcoal `#1A1A1A`
- Make sure text colors default to high contrast.

## 2. Dependencies
- Ensure `framer-motion` is imported in your components. The package is already in `package.json`.
- *(Optional)* Install `lucide-react` if you need elegant UI icons (arrows, quotes, etc).

## 3. Component Breakdown (Create in `components/`)
*Rule: All animations (scroll reveals, transitions, hover effects) MUST use `framer-motion`.*

### `Hero.tsx`
- **Visuals**: Full-screen (`h-screen`) relative container. Absolute background video using `/media/hero-bg.mp4` (`autoPlay`, `muted`, `loop`, `playsInline`, `object-cover`).
- **Overlay**: Subtle dark overlay (`bg-black/40`) to ensure text readability.
- **Content**: Framer Motion `motion.div` with staggered children fade-up.
  - **Headline**: "L'Architetto del Tuo Matrimonio" (Serif, very large, elegant).
  - **Subheadline**: Emphasize luxury and 18 years of experience.
  - **Primary CTA**: Button with gold accent that smooth-scrolls to the Double Funnel section.

### `Method.tsx`
- **Focus**: The "Method" and experience.
- **Design**: Extreme use of negative space (`py-32` or `py-40`), centered text or asymmetrical 2-column layout (text + single elegant image).
- **Animations**: `whileInView` reveals. Slide up with opacity.

### `Portfolio.tsx`
- **Assets**: Use the 12 `.webp` images in `public/media/`. Example: `/media/Sara D'angelo (101).webp`.
- **Layout**: Asymmetrical gallery (CSS Grid). Do not use a basic square grid. Create a magazine-style masonry or staggered grid (e.g., spanning 2 columns, varying heights).
- **Image Optimization**: Use Next.js `<Image>`.
- **Animations**: Each image wrapped in `motion.div` with `whileInView` fade-in. Add subtle scale-up on hover (`whileHover={{ scale: 1.03 }}`).

### `Reviews.tsx`
- **Design**: Clean, elegant typography. Use a serif font for the quotes.
- **Content**: 2-3 static reviews highlighting "luxury" and "flawless execution".
- **Layout**: Can be a horizontal row or a fading carousel. Use framer-motion for switching or revealing.

### `DoubleFunnel.tsx`
- **Layout**: 2-column grid (`grid-cols-1 lg:grid-cols-2`).
- **Left Column: Lead Magnet**
  - "Scarica il Lookbook delle location esclusive."
  - Simple form (Email only, or Name + Email).
  - **Action**: Must import and use `saveLead` from `app/actions/saveLead.ts`. Show loading state, handle error and success UI elegantly without leaving the page.
- **Right Column: Calendly Embed**
  - "Prenota la tua Call Conoscitiva."
  - Embed Calendly using a standard `iframe` pointing to a generic Calendly URL (or a placeholder container if no URL is provided, but use an `iframe` to simulate the embed).

## 4. Page Assembly (`app/page.tsx`)
- Clear out the existing scaffolding logic.
- Import the new components (`Hero`, `Method`, `Portfolio`, `Reviews`, `DoubleFunnel`).
- Compose them vertically within a `<main>` tag.
- Ensure the page renders as a server component where possible, leaving `framer-motion` and interactive forms to `'use client'` component islands.
