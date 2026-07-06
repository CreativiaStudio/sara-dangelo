# Handoff Report: M1 Design & Implementation Plan

## 1. Observation
- `SCOPE.md` specifies replacing `#2A2A2A` with warm brown `#4A3B32` and using beige/gold tones for video blending, with no black or dark mode. It also demands luxurious, slow scrollytelling animations.
- `app/globals.css` currently sets `--foreground: #2A2A2A`.
- `app/layout.tsx` hardcodes `text-[#2A2A2A]` on the body tag.
- `components/HeroSection.tsx` uses `bg-black/40` and black radial gradients for its video overlay. It also uses standard framer-motion easing (`easeOut` and `[0.2, 0.65, 0.3, 0.9]`).
- `components/Navbar.tsx` switches text color to `#2A2A2A` upon scrolling and uses standard ease (`easeInOut`).

## 2. Logic Chain
1. **Palette Compliance**: To remove all traces of black, the global `--foreground` and `body` text classes must be updated to `#4A3B32`. The Navbar must reflect this when scrolling.
2. **Video Overlays**: The video needs to remain visible and readable for text. Replacing `bg-black` with stacked `mix-blend-mode` overlays (`mix-blend-color` with `#B5952F` and `mix-blend-multiply` with `#4A3B32`) achieves a warm, sepia/gold cinematic look without using black.
3. **Luxurious Animations**: A Vogue-like aesthetic requires extended durations and steep bezier curves so that elements snap into motion quickly but settle very slowly. A custom easing of `[0.16, 1, 0.3, 1]` across durations of 1.2s to 1.8s matches this perfectly. Adding slight rotation and blur on initial states amplifies the high-end feel.

## 3. Caveats
- The opacity values (`opacity-30` for color, `opacity-50` for multiply) might need slight visual tuning once applied, depending on the actual brightness of the `hero-bg.mp4` video. The implementer should adjust opacity slightly if the text contrast is insufficient.
- The `noise-bg` uses white/transparent noise with `mix-blend-mode: overlay`, which is generally fine, but if it lightens the video too much, it might need to switch to `soft-light`.

## 4. Conclusion
The M1 implementation should proceed with:
- Global CSS updates to swap `#2A2A2A` with `#4A3B32`.
- Updating the Hero video overlays to use CSS `mix-blend-mode` with the project's warm palette.
- Implementing custom framer-motion variants (`[0.16, 1, 0.3, 1]` ease, `1.6s` duration, y-offset with slight rotation/blur) on the Hero Section and Navbar.
Detailed technical blueprints are in `analysis.md`.

## 5. Verification Method
- **Palette**: `grep -r "2A2A2A" app/ components/` should return no results upon completion.
- **Visual Check**: Run the app locally, inspect the Hero section video. It should possess a golden-brown hue and no `#000000` layers. The text animations on refresh should feel distinctly slow and elegant.
