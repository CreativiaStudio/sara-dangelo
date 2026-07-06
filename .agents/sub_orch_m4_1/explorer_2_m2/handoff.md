# Handoff: PortfolioSection Redesign Plan

## 1. Observation
- `components/PortfolioSection.tsx` currently uses an accordion interaction that expands a location to reveal a gallery.
- The expanded gallery uses a dense CSS-column masonry layout (`columns-1 md:columns-2 lg:columns-3`).
- Images animate in with simple opacity and Y-axis translation via Framer Motion's `initial`/`animate` on mount.
- Palette is strictly `#3D312A`, `#4A3B32`, `#FDFBF7`, and `#D4AF37`.

## 2. Logic Chain
- The prompt requests a "High Fashion magazine-style experience" with a "luxurious, asymmetrical photo layout" and "sparse gallery with huge padding". The current masonry grid is too dense and standard.
- Removing CSS columns and switching to a vertically spaced, flex-based asymmetric layout satisfies the "sparse" and "asymmetrical" requirement.
- The prompt requests emphasizing "framer-motion parallax and slow reveals." The current simple entrance animations are insufficient. We must implement `useScroll` and `useTransform` to tie image movement directly to the user's scroll position, creating overlap and parallax.
- To maintain the palette, all styling, overlays, and shadows must use the brown/cream/gold colors (e.g., using `#4A3B32` for image placeholder backgrounds).

## 3. Caveats
- Implementing `useScroll` effectively requires individual elements to have references (`useRef`). Since images are currently mapped over inside a toggleable accordion, the accordion's dynamic height might interfere with scroll tracking if not handled carefully. Framer Motion handles this well generally, but the scroll targets need to be correctly assigned to the image wrappers.
- The continuous "Sticky Scrollytelling" approach (Option B in my analysis) is also a viable High Fashion pattern, but replacing the accordion's internal grid with an asymmetrical vertical spread (Option A) maintains the current UX paradigm while drastically improving the visual luxury.

## 4. Conclusion
The implementer should proceed with redesigning the expanded state of the accordion into an Asymmetrical Editorial Spread:
1. Remove `columns-1 md:columns-2 lg:columns-3`.
2. Use a `flex flex-col` container with massive vertical gaps (e.g., `gap-y-32` or `space-y-40`).
3. Iterate over the images, assigning them deterministic alternating alignments and widths (e.g., 60% width left-aligned, then 40% width right-aligned, then 80% width centered).
4. Apply Framer Motion's `useScroll` and `useTransform` to each image wrapper to give them varying vertical scroll speeds (parallax), so they overlap slightly as the user scrolls.
5. Strictly use the existing palette (`#3D312A`, `#4A3B32`, `#FDFBF7`, `#D4AF37`) for any backgrounds, text, or visual accents.

## 5. Verification Method
- **Review Code**: Inspect `components/PortfolioSection.tsx` to confirm the removal of masonry classes (`columns-*`) and the introduction of `useScroll` / `useTransform` for parallax.
- **Visual Inspection**: Run the application (`npm run dev`) and open the portfolio section. Click a location to expand. Verify that the gallery is sparse, asymmetrical, and exhibits parallax scrolling without pure black colors.
