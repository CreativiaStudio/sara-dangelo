# Handoff Report

## 1. Observation
- `HeroSection.tsx:29` has `<h1>Sara D'angelo</h1>`, missing the required copy.
- `app/globals.css:25` contains `font-family: Arial, Helvetica, sans-serif;` on the `body` tag, overriding Next.js fonts.
- `test_supabase.js` is an unused test script causing lint errors because it uses `require()` instead of `import` and has an unused variable.
- `npm run build` fails because another Next.js process is already running on port 3000.
- `DoubleFunnelSection.tsx` relies on HTML5 validation (`type="email"`, `required`). The E2E tests (`tier1.spec.ts`, `tier2.spec.ts`) expect explicit DOM text like `Invalid email format` and `Name is required` upon form submission.
- `DoubleFunnelSection.tsx` is missing a Name input field (expected by `tier2.spec.ts:26`).
- `DoubleFunnelSection.tsx` uses an inline `<iframe>` for Calendly, but `tier1.spec.ts:54` expects a link (`getByRole('link', { name: /calendly.../ })`) that opens a popup.
- `ReviewsSection.tsx:22` uses `<section id="reviews">`, but tests expect `#social-proof`.
- `PortfolioSection.tsx` does not have classes `.portfolio-grid`, `.portfolio-image-container`, `.portfolio-image`, or `.hover-info` expected by `tier2.spec.ts`.
- `PortfolioSection.tsx` image paths contain spaces and apostrophes (`"Sara D'angelo (101).webp"`). In `next/image`, these must be URL-encoded, causing the WebP network request test to fail because unencoded spaces return 400 Bad Request instead of `image/webp`.
- The application is completely missing a Navbar component (tests expect `.desktop-nav`, `.mobile-menu`, and a hamburger `<button>` in `tier1.spec.ts:147` and `tier2.spec.ts:175`).

## 2. Logic Chain
- To satisfy Reviewer 1, `HeroSection.tsx` must include the specific positioning in the `<h1>`: "Sara D'angelo - Architetto del Matrimonio. 18 anni di carriera."
- To satisfy Reviewer 2, `globals.css` must have `font-family` removed from the `body` tag.
- To satisfy Reviewer 3, `test_supabase.js` should simply be deleted, as it is legacy.
- To satisfy Reviewer 4, the build script/process must first kill any existing processes on port 3000 (the worker should run `npx kill-port 3000` before building).
- To fix E2E tests (Integrity Violation & Challenger Report):
  - **Form**: Add a Name field. Disable native validation (e.g. `noValidate` on form). Add custom React state validation to render explicit error text ("Name is required", "Email is required", "Invalid email format"). Also render `<div data-testid="submitted-name">{name}</div>` upon success.
  - **Calendly**: Replace the iframe with `<a href="https://calendly.com/sara-dangelo-test/30min" target="_blank" ...>Prenota Appuntamento su Calendly</a>`.
  - **Sections**: Update `id="reviews"` to `id="social-proof"` in `ReviewsSection.tsx`.
  - **Classes**: Add `.hero-video` to the video element in `HeroSection.tsx`. Add `.portfolio-grid` to the grid div, `.portfolio-image-container` to the wrapper div, `.portfolio-image` to the `Image`, and a `.hover-info` div overlay in `PortfolioSection.tsx`. Add `.animate-on-scroll` to at least one animated element.
  - **Images**: Change the `src` in `PortfolioSection.tsx` to use `encodeURIComponent(img)` so Next.js Image optimizer can fetch and serve them without 400 errors.
  - **Navbar**: Implement a basic Navigation component with `.desktop-nav` and `.mobile-menu` and include it in `layout.tsx`.

## 3. Caveats
- There may be other specific class expectations hidden deeper in `tier2.spec.ts` if the initial fixes reveal more.
- Port 3000 might be locked by an external non-node process, requiring manual task manager intervention if `npx kill-port 3000` fails.

## 4. Conclusion
The failures are entirely due to test-to-implementation mismatches and minor reviewer violations. The Worker must systematically update the UI components to align with the specific E2E test assertions, delete the offending lint script, fix the global CSS, and use `npx kill-port 3000` prior to running tests/builds.

## 5. Verification Method
1. Inspect `HeroSection.tsx`, `globals.css`, and `test_supabase.js` (should be deleted) for corrections.
2. Run `npm run lint` and verify it passes.
3. Run `npx kill-port 3000` and then `npm run build` to verify it completes.
4. Run `npx playwright test` and verify all tests pass without integrity violations.
