# Handoff Report: Framer Motion Architecture for M2

## 1. Observation
- `PROJECT.md` specifies a "High Fashion/Vogue style" design language with "scrollytelling emozionale" and extreme negative space.
- Explorers 1 and 2 recommended adopting an asymmetrical layout with extreme vertical spacing and utilizing Framer Motion parallax and slow reveals for both `MethodSection.tsx` and `PortfolioSection.tsx`.
- Next.js strict mode and ESLint often fail builds due to unescaped quotes in JSX strings (e.g., `'` instead of `&apos;`) and unused variables or imports.

## 2. Logic Chain
- To achieve the "slow, luxurious reveal," standard Framer Motion defaults are insufficient. We must apply custom slow variants with a dramatic easing curve `[0.16, 1, 0.3, 1]` and durations spanning `1.6s` to `2.0s`.
- Because parallax is mandated, the implementer must utilize `useScroll` with a container `ref` as the `target`, paired with `useTransform` mapped to `scrollYProgress` to offset the `y` coordinate of elements differentially.
- For `MethodSection.tsx`, applying `useTransform` to massive serif numerals will create luxurious depth against the text blocks.
- For `PortfolioSection.tsx`, applying varying `useTransform` speed multipliers based on the mapped image index (e.g., `i % 2 === 0 ? -150 : -50`) will generate the requested asymmetrical overlapping parallax.
- To ensure CI/CD and build stability, a strict rule against unescaped quotes and unused variables must be enforced during implementation.

## 3. Caveats
- Implementing `useScroll` within the accordion structure of `PortfolioSection.tsx` can be problematic if the `target` ref changes height dynamically. The implementer must attach the `ref` to the inner gallery container *inside* the `AnimatePresence` block so `useScroll` accurately calculates progress against the rendered gallery height.
- Ensure `useScroll` and `useTransform` are only used in `"use client"` components.

## 4. Conclusion
The implementer must build the Framer Motion architecture exactly as follows:
- **Global Easing & Duration**: Use `ease: [0.16, 1, 0.3, 1]` and durations of `1.8s` (for text) to `2.0s` (for images).
- **Parallax Implementation**: Implement `useScroll` tracking container refs, and `useTransform(scrollYProgress, [0, 1], [start, end])` to drive vertical parallax (`y`) on typography and image wrappers.
- **Asymmetry in Code**: For `PortfolioSection`, map the parallax offset dynamically by index to force varying scroll speeds across the images.
- **ESLint Compliance (CRITICAL)**: The implementer MUST manually replace all single quotes with `&apos;` in JSX (e.g., `L&apos;Attesa`) and delete all unused variables/imports to avoid build failures.

## 5. Verification Method
- **Code Review**: Inspect `components/MethodSection.tsx` and `components/PortfolioSection.tsx` to verify `useScroll`, `useTransform`, the specified easing `[0.16, 1, 0.3, 1]`, and the use of `&apos;` in text strings.
- **Lint Check**: Run `npm run lint` to explicitly verify no unused variables or unescaped quote errors remain.
- **Visual Validation**: Run `npm run dev`, expand a portfolio gallery, and scroll to visually confirm the staggered, overlapping parallax and the slow ~1.8s fade-in animations.
