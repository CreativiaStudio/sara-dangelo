# Handoff: Tier 2 E2E Tests (Boundary and Corner Cases)

## 1. Observation
- Read `TEST_INFRA.md` which requires Tier 2 tests to cover "Boundary and corner cases, >= 5 tests per feature where applicable". Target is `tests/e2e/tier2.spec.ts`.
- Read `ORIGINAL_REQUEST.md` to identify the 4 main features:
  - **F1:** Lead Generation Form (Supabase integration, Calendly embed)
  - **F2:** Media Optimization (WebP, video background, lazy loading)
  - **F3:** Responsive Layout (editorial "magazine" style, fluid, mobile-friendly)
  - **F4:** Scroll Animations (Framer Motion, scroll reveals, hover states)
- The application source (e.g. `app/page.tsx`) is currently the Next.js default, meaning the UI isn't built yet. However, per the test philosophy ("Opaque-box, requirement-driven"), tests can and should be designed against the expected functional interface.

## 2. Logic Chain
- To achieve the required >= 5 boundary/corner cases per feature, we leverage Playwright's advanced capabilities (network interception, viewport emulation, accessibility emulation, etc.).
- **F1 (Lead Gen):** Focuses on input validation edges (empty, malformed, extreme length), interaction edge cases (double submission), and network edge cases (API failures).
- **F2 (Media):** Focuses on network constraints (slow 3G, aborted requests), format headers, and viewport handling of large assets.
- **F3 (Layout):** Explores viewport extremes (280px narrow, 4k wide), rapid resizing, and high zoom levels to ensure the "magazine" layout doesn't break.
- **F4 (Animations):** Tests interaction boundaries like instant scrolling, direction changes mid-animation, accessibility constraints (`prefers-reduced-motion`), and deep-link scroll positions.

## 3. Caveats
- Because the exact DOM elements (IDs, classes) are not yet implemented, the proposed tests must use semantic locators (e.g., `getByRole('button', { name: /prenota|invia|submit/i })` or `getByPlaceholder('Email')`) to remain resilient, or wait for the implementation.
- The tests will likely fail until the UI is built, which is standard for Test-Driven Development (TDD) at the E2E level.
- Mocking Supabase endpoints requires intercepting requests matching `**/rest/v1/*` or similar patterns.

## 4. Conclusion
I have designed 20 specific Tier 2 test cases (5 per feature) targeting boundary and corner cases. 

### Test Plan: `tests/e2e/tier2.spec.ts`

**Feature 1: Lead Generation Form**
1. **Empty Submission:** Attempt to submit with empty fields; verify HTML5 or custom validation messages appear preventing submission.
2. **Invalid Email Formats:** Submit emails missing `@`, domains, or using special characters; verify rejection.
3. **Extreme String Lengths:** Submit names/emails with 256+ characters; verify max-length constraints or graceful truncation.
4. **Rapid Double Submission:** Click the submit button multiple times rapidly; verify only one network request is dispatched and the button becomes disabled/loading.
5. **Network Failure Simulation:** Intercept the API response to return a 500 Error; verify the UI shows a graceful error message instead of crashing.

**Feature 2: Media Optimization**
1. **Broken Image Fallback:** Abort image requests via Playwright network routing (`route.abort()`); verify `alt` text is visible and the layout does not collapse.
2. **Slow Network (3G):** Throttle the network; verify lazy loading placeholders/skeletons are visible while media loads.
3. **WebP Verification:** Intercept image requests to ensure `accept: image/webp` is sent by the browser.
4. **Video Autoplay Fallback:** Intercept the video request to fail; verify the layout remains intact (no blank empty space).
5. **Quick Navigation:** Navigate away from the page while large media is loading; verify no console errors or memory leaks occur.

**Feature 3: Responsive Layout**
1. **Extreme Narrow Viewport (280px):** Emulate a tiny device (e.g., Galaxy Fold width); verify no horizontal scrolling occurs (`evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)`).
2. **Extreme Wide Viewport (3840px):** Emulate 4K width; verify the content `max-width` is constrained and properly centered, maintaining the magazine aesthetic.
3. **Rapid Viewport Resize:** Resize window rapidly from mobile to desktop and back; verify layout grid updates correctly without elements overlapping.
4. **Zoom 200%:** Emulate 200% zoom scale (using CSS transform or testing constraints); verify text remains readable and buttons remain clickable.
5. **Orientation Change:** Emulate a mobile portrait to landscape flip; verify sections adjust their flex/grid layouts properly.

**Feature 4: Scroll Animations (Framer Motion)**
1. **Fast Scrolling:** Scroll instantly from top to bottom; verify all reveals complete successfully and no content remains invisible (`opacity: 0`).
2. **Yo-yo Scrolling:** Scroll down to trigger an animation, then immediately scroll up; verify the animation engine doesn't glitch or break the page layout.
3. **Prefers Reduced Motion:** Emulate `prefers-reduced-motion: reduce`; verify animations are skipped or set to instant transition, checking that opacity goes to 1 immediately.
4. **Deep Link Initial Load:** Load page with an initial scroll position (`window.scrollY = 2000`); verify elements in the viewport are already rendered and visible without needing to scroll further.
5. **Rapid Hover Interruption:** Move the mouse rapidly in and out of interactive elements (buttons, portfolio images) to test Framer Motion hover states; verify they return to the default state without getting stuck.

## 5. Verification Method
- The Implementer (Worker) will translate the Test Plan into Playwright code in `tests/e2e/tier2.spec.ts`.
- Run the tests using `npx playwright test tests/e2e/tier2.spec.ts`.
- Since tests are opaque-box, they act as living requirements. They are considered structurally complete once Playwright can parse and execute them, and functionally passing once the app satisfies the criteria.
