# Analysis of HeroSection.tsx Video Overlay

## Core Issue
The `HeroSection.tsx` component features a background video with two overlay layers designed to provide contrast for the white text on top. However, the current implementation fails to provide sufficient contrast, resulting in readability issues, especially when the background video contains bright or light-colored elements.

### Current Overlay Implementation
```tsx
{/* Sfondo generale scuro */}
<div className="absolute top-0 left-0 w-full h-full bg-[#4A3B32]/40"></div>

{/* Gradiente Radiale */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-[radial-gradient(circle,_rgba(74,59,50,0)_0%,_rgba(74,59,50,0.65)_100%)] pointer-events-none"></div>
```

### identified flaws
1. **Lack of Blend Mode (`mix-blend-multiply`)**: The overlays currently use standard alpha blending. Without `mix-blend-multiply`, the brown color (`#4A3B32`) simply washes out the video rather than deepening the dark tones. `mix-blend-multiply` is essential in high-fashion/luxury web design to create a moody, cinematic look that ensures text pops by darkening the underlying media proportionately.
2. **Transparent Gradient Center**: The radial gradient goes from `rgba(74,59,50,0)` (0 opacity) at `0%` to `rgba(74,59,50,0.65)` at `100%`. Since the most critical text (the main headline "La Bellezza Senza Tempo") is positioned dead-center, it sits over the `0%` opacity area of the gradient. If the video happens to be bright in the center, the white text will become completely unreadable.

## Recommendations

To resolve this, we need to apply `mix-blend-multiply` and increase the opacity in the center of the radial gradient, so that the center is never completely transparent.

### Proposed Changes

**1. General Dark Overlay**
Apply `mix-blend-multiply` and slightly increase the opacity to provide a strong base level of darkness.
- **Old Classes**: `absolute top-0 left-0 w-full h-full bg-[#4A3B32]/40`
- **New Classes**: `absolute inset-0 bg-[#4A3B32]/50 mix-blend-multiply`

**2. Radial Gradient Overlay**
Increase the center opacity from `0` to at least `0.4` (or `40%`) and the outer opacity from `0.65` to `0.8`. We can also apply `mix-blend-multiply` here to compound the darkening effect seamlessly.
- **Old Classes**: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-[radial-gradient(circle,_rgba(74,59,50,0)_0%,_rgba(74,59,50,0.65)_100%)] pointer-events-none`
- **New Classes**: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-[radial-gradient(circle,_rgba(74,59,50,0.4)_0%,_rgba(74,59,50,0.8)_100%)] mix-blend-multiply pointer-events-none`

### Code Snippet of Recommended Fix

```tsx
{/* Overlay: Sfondo generale scuro + Gradiente Radiale marcato al centro per leggibilità */}
<div className="absolute inset-0 bg-[#4A3B32]/50 mix-blend-multiply pointer-events-none"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-[radial-gradient(circle,_rgba(74,59,50,0.4)_0%,_rgba(74,59,50,0.8)_100%)] mix-blend-multiply pointer-events-none"></div>
```

This configuration ensures the center of the screen always has at least a baseline darkening effect multiplying against the video, guaranteeing the white text (`text-[#FDFBF7]`) remains fully readable under any video conditions.
