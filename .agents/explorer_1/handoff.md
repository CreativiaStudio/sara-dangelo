# Forensic Audit Fix Strategy (Iteration 2)

## 1. Observation
- **Font Build Error**: `npm run build` fails. While the network block causes a fetch failure, the actual `app/globals.css` does not map the fonts correctly for Tailwind v4. It still contains `--font-sans: var(--font-geist-sans);` instead of mapping `--font-playfair` and `--font-lato`. `app/layout.tsx` imports are written correctly (`import { Playfair_Display, Lato } from "next/font/google";`).
- **Hero Headline**: `components/HeroSection.tsx` exactly uses "L'Architetto del tuo Matrimonio" (line 37), violating the instruction to be original.
- **Image Sizes**: Images in `public/media/` are up to 5.5MB. `components/PortfolioSection.tsx` uses `<Image>` but lacks a `quality` prop and `next.config.ts` lacks format optimization to aggressively compress these large WebP files.
- **Linting & Test Results**: `npm run lint` fails with an `ESLintIgnoreWarning` because `.eslintignore` is deprecated in ESLint 9. Furthermore, the linter actually fails because it scans the `.agents/` folder and flags `require()` statements in old test scripts (e.g. `check_framer.js`). Also, `test-results` contains 54 old Playwright artifact folders that caused the forensic audit failure.
- **Missing IDs**: Components like `PortfolioSection.tsx` (line 23) and `HeroSection.tsx` (line 7) lack `id` attributes on their root `<section>` tags.

## 2. Logic Chain
1. **Fonts**: For Tailwind v4 to recognize Next.js font CSS variables injected in `layout.tsx`, `globals.css` must map them within `@theme inline`. Fixing this resolves the core styling mismatch, fulfilling the reviewer's requirement. 
2. **Hero Headline**: Replacing the static string in `HeroSection.tsx` with a unique copy (e.g., "Progettiamo l'Emozione Perfetta per il Tuo Sì") satisfies the originality constraint.
3. **Image Configuration**: Adding `quality={50}` to `<Image>` in `PortfolioSection.tsx` and adding `images: { formats: ['image/avif', 'image/webp'] }` to `next.config.ts` enforces aggressive Next.js image optimization, resolving the massive size issue during runtime.
4. **Linting & Artifacts**: Removing `.eslintignore` fixes the warning. Updating `eslint.config.mjs` with `globalIgnores` for `.agents/**`, `test-results/**`, and `playwright-report/**` prevents linting errors on old scripts. Finally, deleting `test-results` removes the old artifacts failing the forensic audit.
5. **Anchor Navigation**: Adding `id="hero"`, `id="portfolio"`, etc., to the root `<section>` tags in each component directly enables smooth scrolling.

## 3. Caveats
- The `next/font/google` build error may still throw network-related warnings in a strictly offline CODE_ONLY environment (`Failed to fetch`), but the CSS mapping fix satisfies the architectural requirement specified by the reviewer.
- Relying on Next.js `<Image>` runtime optimization for 5.5MB images might be CPU-intensive on the first request; reducing `quality` to 50 is a necessary mitigation.

## 4. Conclusion
The worker must apply a specific set of localized fixes to resolve the 5 violations:
1. Update `app/globals.css` mapping:
   ```css
   @theme inline {
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     --font-serif: var(--font-playfair);
     --font-sans: var(--font-lato);
   }
   ```
2. Edit `components/HeroSection.tsx` headline to be original.
3. Add `id` tags (`id="hero"`, `id="method"`, `id="portfolio"`, `id="reviews"`, `id="contact"`) to all 5 section components.
4. Add `quality={50}` to `PortfolioSection.tsx` images and update `next.config.ts` to include `images: { formats: ['image/avif', 'image/webp'] }`.
5. Update `eslint.config.mjs` to add `".agents/**"`, `"test-results/**"`, `"playwright-report/**"` to `globalIgnores`. Delete `.eslintignore`. Run `Remove-Item -Recurse -Force test-results`.

## 5. Verification Method
- Run `npm run build` to verify the build process (ignoring network font timeouts if offline, but ensuring no module resolution errors).
- Run `npm run lint` to ensure 0 errors and no `.eslintignore` warnings.
- Inspect `test-results` to ensure it is completely deleted.
