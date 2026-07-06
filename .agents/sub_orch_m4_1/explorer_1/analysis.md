# Milestone 1: Global Setup & Hero - Design and Implementation Plan

## 1. Overview
The goal of this milestone is to align the foundational global styles and the Hero/Navbar components with the requested "High Fashion / Vogue" design language. The aesthetic strictly prohibits pure black and dark mode, relying instead on a palette of cream/white (`#FDFBF7`), warm brown (`#4A3B32`), and gold/beige accents (`#D4AF37`, `#B5952F`). Animations must be slow, premium, and luxurious.

## 2. Global Setup Adjustments
Currently, the codebase references `#2A2A2A` (a very dark gray) as the primary text color, which violates the strict palette constraint.

**`app/globals.css` Changes:**
- Update `:root` to set `--foreground: #4A3B32;` (instead of `#2A2A2A`).
- Update `@media (prefers-color-scheme: dark)` to also use `--foreground: #4A3B32;` to prevent default dark mode behavior.

**`app/layout.tsx` Changes:**
- In the `<body>` tag, change the Tailwind class `text-[#2A2A2A]` to `text-[#4A3B32]`.

## 3. Navbar Overhaul (`components/Navbar.tsx`)
The Navbar logic supports scrollytelling but needs palette alignment.
- **Color Replacement**: Search and replace all instances of `text-[#2A2A2A]` with `text-[#4A3B32]`. This applies to the logo, desktop links (when scrolled), mobile menu toggle, and mobile dropdown links.
- **Animation Speed**: The entrance and hide/show transitions are currently 0.5s. Consider slowing them to `0.8s` with `ease: [0.16, 1, 0.3, 1]` for a more luxurious feel.

## 4. Hero Section Redesign (`components/HeroSection.tsx`)
The Hero section currently relies on black overlays and backgrounds, which must be completely removed.

**Background & Video Overlay (Beige/Gold Blend):**
- Remove `bg-black` from the root `<section>` and replace it with `bg-[#FDFBF7]` or a warm beige.
- **Flat Overlay**: Change `bg-black/40` to a warm brown or beige/gold mix. For example: `bg-[#4A3B32]/30` (warm brown overlay) or `bg-[#D4AF37]/20 mix-blend-multiply`.
- **Radial Gradient**: Replace `bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.65)_0%,_rgba(0,0,0,0)_70%)]`.
  - Proposed High-Fashion Gradient: `bg-[radial-gradient(ellipse_at_center,_rgba(74,59,50,0.5)_0%,_rgba(212,175,55,0.05)_70%)]` (using the RGB of `#4A3B32` and `#D4AF37`).
- **Typography Colors**: Ensure text remains readable. Given the lighter/warmer overlays, standard text can either be the cream `#FDFBF7` (if the overlay is dark enough) or the warm brown `#4A3B32`. The `text-[#FDFBF7]` is fine assuming the warm brown overlay gives enough contrast.

**Slow framer-motion Animations:**
- **Title Animations**: 
  - `titleItem`: Increase duration from `1.2s` to `2.0s`. Use a luxurious easing like `ease: [0.16, 1, 0.3, 1]`.
  - `titleContainer`: Increase `staggerChildren` from `0.15` to `0.3` or `0.4` to make the sequential appearance more deliberate and dramatic.
- **Labels & Paragraphs**:
  - Increase the duration of the upper label and paragraph fades from `1.5s` to `2.2s`.
- **CTA Button**:
  - Replace `group-hover:text-black` with `group-hover:text-[#4A3B32]`.
  - Increase transition duration of the hover effect slightly for a softer fill.

## 5. Summary of Deliverables
- `globals.css`: Palette fix.
- `layout.tsx`: Body text color fix.
- `Navbar.tsx`: Palette fix and subtle animation timing tweaks.
- `HeroSection.tsx`: Complete overhaul of overlays (removing black, using warm brown/gold gradients) and slowing down all `framer-motion` timelines.
