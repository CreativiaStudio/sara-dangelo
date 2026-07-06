# Handoff: HeroSection Video Overlay Analysis

## 1. Observation
In `components/HeroSection.tsx`, the overlays for the background video (lines 35-37) are implemented as follows:
```tsx
{/* Overlay: Sfondo generale scuro + Gradiente Radiale marcato al centro per leggibilità */}
<div className="absolute top-0 left-0 w-full h-full bg-[#4A3B32]/40"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-[radial-gradient(circle,_rgba(74,59,50,0)_0%,_rgba(74,59,50,0.65)_100%)] pointer-events-none"></div>
```
- The general overlay uses an alpha opacity (`bg-[#4A3B32]/40`) without any blending modes.
- The radial gradient overlay has a transparent center (`rgba(74,59,50,0)` at `0%`).
- No `mix-blend-multiply` classes are applied to darken the video underneath properly.

## 2. Logic Chain
1. The absence of `mix-blend-multiply` causes the brown overlay to simply wash over the video instead of darkening the underlying light pixels.
2. The center of the radial gradient is completely transparent (`0%` opacity).
3. The main headline ("La Bellezza Senza Tempo") is positioned perfectly in the center.
4. Because the center has zero opacity from the gradient and a weak general overlay without multiply blending, any bright spots in the background video will clash with the white text (`text-[#FDFBF7]`), causing readability issues and failing contrast requirements.

## 3. Caveats
- I did not test the actual video (`/media/hero-bg.mp4`) as I cannot render it, but structurally, a transparent center and lack of multiply blending are known causes of low text contrast over video.
- Opacity values might need fine-tuning in the browser (e.g., if `0.4` is too dark, it could be tweaked to `0.3`), but `0.4` is a solid starting point for guaranteed contrast.

## 4. Conclusion
To ensure the white High Fashion text is fully readable, the center of the radial gradient must have a baseline opacity, and both overlays should utilize `mix-blend-multiply`. 

**Proposed Code Change:**
Replace lines 36-37 in `components/HeroSection.tsx` with:
```tsx
<div className="absolute inset-0 bg-[#4A3B32]/50 mix-blend-multiply pointer-events-none"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-[radial-gradient(circle,_rgba(74,59,50,0.4)_0%,_rgba(74,59,50,0.8)_100%)] mix-blend-multiply pointer-events-none"></div>
```

## 5. Verification Method
1. Modify `components/HeroSection.tsx` with the proposed changes.
2. Start the development server (`npm run dev`).
3. Load the landing page and observe the hero section text. The background video should look moodier, and the white text should have high contrast and remain legible even if the video background transitions to lighter scenes.
