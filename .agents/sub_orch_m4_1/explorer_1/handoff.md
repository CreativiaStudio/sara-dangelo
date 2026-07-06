# Handoff Report: Milestone 1 (Global Setup & Hero)

## 1. Observation
- `SCOPE.md` and `PROJECT.md` strictly forbid pure black/dark mode and dictate a palette of `#FDFBF7` (background), `#4A3B32` (text), and `#D4AF37` / `#B5952F` (gold accents). The design requires slow framer-motion animations and a beige/gold blend for video overlays.
- **`app/globals.css` (Lines 5, 23)**: `--foreground` is incorrectly set to `#2A2A2A` (dark gray/black) instead of `#4A3B32`.
- **`app/layout.tsx` (Line 54)**: `<body>` uses `text-[#2A2A2A]`.
- **`components/Navbar.tsx` (Lines 42, 48, 60, 82)**: References `text-[#2A2A2A]` which violates the palette constraint.
- **`components/HeroSection.tsx` (Line 23, 36, 37)**: Relies heavily on pure black: `<section>` uses `bg-black`, flat overlay uses `bg-black/40`, and radial overlay uses `rgba(0,0,0,0.65)`.
- **`components/HeroSection.tsx` (Line 10, 18, 49, 80, 94)**: Animation durations are fast (`1.2s` - `1.5s`) with standard staggers (`0.15s`), contrary to the "slow, premium" requirement. Hover text on the CTA button uses `group-hover:text-black`.

## 2. Logic Chain
1. The project's "High Fashion" aesthetic prohibits black, so `#2A2A2A` must be eradicated from global text definitions and components, replaced universally by `#4A3B32`.
2. The Hero video overlay uses pure black. To achieve the requested "beige/gold blend" while retaining text contrast, the black overlays must be converted to warm brown (`rgba(74, 59, 50, X)`) and gold (`rgba(212, 175, 55, X)`) variants.
3. The requested "slow framer-motion animations" require increasing transition durations across the Hero section to ~2.0s and increasing stagger delays to create a deliberate, scrollytelling feel.

## 3. Caveats
- No caveats. The layout and scope are clearly defined, and there are no external dependencies blocking this implementation. Text contrast over the new beige/brown video overlay might need subjective tuning during implementation to ensure legibility.

## 4. Conclusion
The foundation for Milestone 1 requires a straightforward find-and-replace of the `#2A2A2A` color code with `#4A3B32` across `globals.css`, `layout.tsx`, and `Navbar.tsx`. For the `HeroSection.tsx`, the implementer must remove all `bg-black` and `rgba(0,0,0)` definitions, replacing them with warm brown/gold equivalents, and slow all `framer-motion` properties (durations -> `2.0s`, staggerChildren -> `0.3s`, using premium easing curves).

## 5. Verification Method
- **Code Inspection**: Search the codebase for `#2A2A2A` or `black` (excluding standard Tailwind resets). There should be 0 matches in the modified files.
- **Build**: Run the Next.js dev server or build command to ensure no syntax errors were introduced.
- **Visual Check**: Open the Hero section in a browser to confirm the video overlay is brown/gold (not black) and animations take visibly longer to complete.
