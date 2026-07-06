# Handoff Report: Tier 1 E2E Test Design

**1. Observation**
- `TEST_INFRA.md` requires ≥5 tests per feature for Tier 1 tests (Opaque-box, requirement-driven).
- `ORIGINAL_REQUEST.md` specifies 4 core areas that correspond to the features:
  1. Lead Generation Form (Double funnel: email capture to Supabase, CTA to Calendly).
  2. Media Optimization (WebP images, compressed background loop video with autoplay/muted).
  3. Responsive Layout & Sections (5 sections: Hero, Metodo, Portfolio, Social Proof, Funnel).
  4. Scroll Animations (framer-motion for scroll reveals, hover states, premium feel).
- Tests must be placed in `tests/e2e/tier1.spec.ts` (as per `TEST_INFRA.md`).

**2. Logic Chain**
- Since this is opaque-box testing, tests must rely on observable DOM states, text matching, and attributes derived purely from the original request.
- **Feature 1 (Lead Gen)**: Needs tests for form visibility, successful submission, validation errors (empty and format), and the final CTA functional redirect/modal.
- **Feature 2 (Media)**: Needs checks for the hero video attributes (`autoplay`, `loop`, `muted`), WebP presence, lazy loading attributes on below-fold images, and accessibility `alt` texts.
- **Feature 3 (Responsive)**: Needs checks for the 5 key sections to exist, mobile navigation adaptation, prevention of horizontal overflow on mobile, stacking of portfolio grid on mobile, and text visibility across viewports.
- **Feature 4 (Animations)**: Needs checks for framer-motion artifacts. Specifically, scroll into view reveals (verifying elements gain dimensions/visibility), hover state animations on portfolio items, and the presence of inline styles typical of framer-motion (`opacity`, `transform`).

**3. Caveats**
- Tests use text regexes like `/Lookbook/i`, `/18 anni/i`, and `/Prenota/i` which depend on the exact copy implemented. If the implementer chooses different text, the locators will need adjustment.
- Testing framer-motion animations via E2E involves checking inline styles or visual changes over timeouts (e.g., waiting 500ms for hover), which can occasionally be flaky.
- Since I am operating read-only, I have written the test code into a proposed file rather than directly modifying the project's source code.

**4. Conclusion**
I have fully designed the 20 Tier 1 tests (5 per feature) and placed the exact test scenarios in a proposed spec file.
The planned test titles are:
*Feature 1 - Lead Generation Form*
- `form is visible and contains email input, submit button, and download text`
- `form submission with valid email shows success state`
- `form submission with empty email shows validation error`
- `form submission with invalid email format shows validation error`
- `CTA for "Prenota la tua Call" is present and functional`

*Feature 2 - Media Optimization*
- `Hero video background is present with autoplay, loop, muted`
- `Hero video uses proper source tags`
- `Portfolio images use modern formats or picture tags`
- `Images below the fold have lazy loading attribute`
- `All functional images have alt text for accessibility`

*Feature 3 - Responsive Layout & Sections*
- `The 5 key sections are present`
- `Mobile viewport layout adaptation (navigation)`
- `Content flows correctly without horizontal scroll on mobile`
- `Portfolio grid adapts to mobile (elements are stacked)`
- `Il Metodo section text is visible on mobile`

*Feature 4 - Scroll Animations (framer-motion)*
- `Elements in "Il Metodo" animate into view`
- `Portfolio images trigger slide-in or fade-in on scroll`
- `Hovering over portfolio image triggers transformation/animation`
- `Framer-motion specific inline styles are present`
- `Social proof cards animate sequentially`

**5. Verification Method**
The proposed test suite is located at: `c:/Users/mario/Progetti Antigravity/sara-dangelo/.agents/tier1_test_designer/proposed_tier1.spec.ts`.
An implementing agent should copy these tests into `tests/e2e/tier1.spec.ts`. To verify them, run `npx playwright test tests/e2e/tier1.spec.ts`. If tests fail due to locator mismatches, the implementer can adjust the text or CSS selectors to match the final DOM implementation.
