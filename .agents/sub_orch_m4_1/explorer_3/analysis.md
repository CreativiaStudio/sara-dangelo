# Analysis & Design Plan: M1 (Global Setup & Hero)

## 1. Global Setup (Palette Enforcement)
**Current State:** 
- `globals.css` defines `--foreground: #2A2A2A`.
- `layout.tsx` applies `text-[#2A2A2A]` to the `<body>`.

**Required Changes:**
- **`globals.css`**: Replace `--foreground: #2A2A2A;` with `--foreground: #4A3B32;` (Warm Brown). Also, update the `@media (prefers-color-scheme: dark)` fallback to enforce `#4A3B32` instead of `#2A2A2A`.
- **`layout.tsx`**: Update the body class to `text-[#4A3B32]` or simply `text-[var(--foreground)]`.

## 2. Framer Motion Implementation (Luxurious Scrollytelling)
To achieve a "High Fashion/Vogue" feel, animations must eschew linear or basic "easeOut" curves in favor of prolonged, smooth cubic-beziers. 

**Recommended Easing:** `[0.16, 1, 0.3, 1]` (Custom Out-Expo).
**Recommended Durations:** 1.2s to 1.8s.

**Variants to Implement in `HeroSection.tsx`:**

1. **Title Container:**
   ```javascript
   const titleContainer = {
     hidden: { opacity: 0 },
     show: {
       opacity: 1,
       transition: { staggerChildren: 0.25, delayChildren: 0.3 }
     }
   };
   ```

2. **Title Item (Text Reveal with slight rotation/blur):**
   ```javascript
   const titleItem = {
     hidden: { opacity: 0, y: "120%", rotate: 2, filter: "blur(4px)" },
     show: { 
       opacity: 1, 
       y: 0, 
       rotate: 0,
       filter: "blur(0px)",
       transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } 
     }
   };
   ```
   *Note:* The text should be wrapped in `overflow-hidden` divs.

3. **Fade-Up Elements (Subtitles, CTAs):**
   ```javascript
   const fadeUp = {
     hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
     show: { 
       opacity: 1, 
       y: 0, 
       filter: "blur(0px)", 
       transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 1.2 } 
     }
   };
   ```

## 3. Video Overlay (Beige/Gold Blending)
**Current State:** Uses `bg-black/40` and a dark radial gradient, violating the "NO BLACK OR DARK MODE" rule.

**Recommended Implementation:**
Use stacked layers with CSS `mix-blend-mode` to colorize and darken the video with warm tones. This provides contrast for the text without relying on `#000000`.

```tsx
{/* 1. Colorize: infuses the video with gold/beige tones */}
<div className="absolute inset-0 bg-[#B5952F] mix-blend-color opacity-30 z-0 pointer-events-none"></div>

{/* 2. Multiply: darkens the video for text contrast using warm brown */}
<div className="absolute inset-0 bg-[#4A3B32] mix-blend-multiply opacity-50 z-0 pointer-events-none"></div>

{/* 3. Vignette: focuses the center using brown tones instead of black */}
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(74,59,50,0)_0%,_rgba(74,59,50,0.7)_100%)] z-0 pointer-events-none"></div>
```
*(Ensure all text layers have `relative z-10` to sit above the overlays)*.

## 4. Navbar Refinement
**Current State:** Animates visibility and uses `#2A2A2A` when scrolled.
**Required Changes:**
- Update scroll-based color classes from `text-[#2A2A2A]` to `text-[#4A3B32]`.
- Use the luxurious easing curve for the Navbar hide/show animation:
  ```javascript
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  ```
- Ensure the dropdown menu and any hardcoded dark text uses the strict palette `#4A3B32` and `#D4AF37`.
