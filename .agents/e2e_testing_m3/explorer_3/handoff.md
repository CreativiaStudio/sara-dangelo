# Handoff: Tier 2 E2E Tests Plan

## 1. Observation
- Read `TEST_INFRA.md` which mandates "Opaque-box, requirement-driven" testing and boundary/corner cases for Tier 2 tests (≥ 5 per feature).
- Read `SCOPE.md` which states Tier 2 tests focus on "Boundary and corner cases for form validation, network failures, extremes".
- Read `ORIGINAL_REQUEST.md` which specifies 4 key features: 1) Lead Generation Form via Supabase, 2) Media Optimization (WebP/Video, lazy loading), 3) Responsive Layout (Magazine style, no breaking on mobile), 4) Scroll Animations (Framer-motion, premium feel).

## 2. Logic Chain
Based on the testing philosophy, tests must be designed assuming no knowledge of the specific HTML structure yet, using robust Playwright locators (e.g. `data-testid`, roles, or semantic tags) and browser context mockings.
I have designed >= 5 Tier 2 tests per feature:

### Feature 1: Lead Generation Form (Boundary & Corner cases)
1. **Empty Submission**: Attempt to submit the form without filling any fields. Verify that validation errors are displayed and no network request is made.
2. **Invalid Email Format**: Fill the name correctly but use an invalid email (e.g., `invalid-email`). Verify that validation rejects the input.
3. **Double Submission Prevention**: Fill the form correctly and click the submit button rapidly 5 times. Verify that only one network request is sent to Supabase and the button becomes disabled after the first click.
4. **Network Failure Graceful Handling**: Route the Supabase POST request in Playwright to abort or return a 500 status. Verify that the UI displays a graceful error message rather than crashing.
5. **Malicious Input (XSS)**: Enter `<script>alert('xss')</script>` in the name field. Verify that it is submitted and re-rendered safely without execution.

### Feature 2: Media Optimization (WebP/Video)
1. **Video Autoplay Fallback**: Emulate a browser context where autoplay is disabled or low-power mode is active. Verify that the `<video>` element correctly displays the `poster` fallback image.
2. **Lazy Loading Bounds**: Load the page but do not scroll. Verify via Playwright's network interceptor that images in the "Portfolio" and "Social Proof" sections are NOT fetched until the user scrolls down to them.
3. **Slow Network Simulation**: Emulate "Slow 3G" network conditions. Verify that placeholders (e.g., `blurDataURL` or skeleton loaders) are visible for images while they are loading.
4. **Extremely Large Viewport**: Resize the viewport to 3840x2160 (4K). Verify that the Hero video background scales (`object-cover` behavior) to fill the width without exposing white borders.
5. **Image Failure Fallback**: Intercept and abort a request for a portfolio image. Verify that the layout does not break and the `alt` text or a fallback component is rendered.

### Feature 3: Responsive Layout
1. **Minimum Width Constraints**: Resize viewport to 320px (e.g., iPhone SE). Evaluate the page layout to verify there is absolutely no horizontal scrolling (using JavaScript `document.documentElement.scrollWidth === window.innerWidth`).
2. **Orientation Change Adjustment**: Set viewport to 768x1024, then quickly resize to 1024x768. Verify that the grid/flex layouts update gracefully without overlapping text.
3. **Mobile Menu Toggle State**: Open the mobile menu at a 375px viewport, then immediately resize the window to 1200px. Verify that the mobile menu disappears and the desktop navigation is correctly displayed.
4. **Huge Font Size Accommodation**: Inject a CSS rule `html { font-size: 200% !important; }` or use Playwright accessibility tools. Verify that the CTA button text and hero headline do not clip completely out of their containers.
5. **Non-Standard Breakpoint**: Set the viewport to an awkward size (e.g., 850px). Verify that the portfolio grid columns do not leave elements dangling off-screen or create orphaned layout artifacts.

### Feature 4: Scroll Animations (Framer-Motion)
1. **Reduced Motion Preference**: Launch the context with `prefers-reduced-motion: reduce`. Verify that elements normally animated (e.g., scroll reveals) appear immediately without opacity or translation delays.
2. **Rapid Yoyo Scrolling**: Scroll from the top to the bottom of the page in 100ms, then immediately back to the top. Verify that elements return to their correct visible/hidden states without getting stuck in mid-animation.
3. **Deep Link Initialization**: Navigate directly to `/#portfolio` (or the equivalent anchor). Verify that the elements in that section are already visible and not stuck waiting for a scroll event that already happened.
4. **Resize During Animation**: Scroll down to trigger an animation, but right before it finishes, drastically resize the window. Verify the elements settle in their correct final position.
5. **Touch Device Hover Fallback**: Emulate a touch-enabled device. Verify that any crucial information hidden behind a "hover" state in the portfolio is either always visible or safely triggered by a single tap without immediately navigating away.

## 3. Caveats
- The UI components might not have `data-testid` attributes yet. The Worker implementing these tests must add them to the React components or use semantic ARIA roles.
- For "Reduced Motion", it requires the front-end to be correctly implemented utilizing Framer Motion's `useReducedMotion` hook. If not, the test will fail, properly indicating a bug in the implementation.

## 4. Conclusion
The 20 test cases above cover the Tier 2 requirements (>=5 per feature) focusing heavily on boundaries, network extremes, accessibility, and corner cases as mandated. These should be implemented in `tests/e2e/tier2.spec.ts`.

## 5. Verification Method
- The Implementer (Worker) should write these tests in `tests/e2e/tier2.spec.ts`.
- Run the tests via `npx playwright test tests/e2e/tier2.spec.ts`.
- All tests should be present and ideally pass against the components, or clearly fail indicating missing boundary handling in the front-end.
