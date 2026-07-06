# Explorer Handoff: Tier 2 E2E Tests

## 1. Observation
- `TEST_INFRA.md` and `.agents/e2e_testing/SCOPE.md` require Tier 2 testing for boundary and corner cases using an opaque-box, requirement-driven approach.
- Coverage thresholds mandate at least 5 tests per feature.
- `ORIGINAL_REQUEST.md` identifies 4 key features:
  1. **Lead Generation Form**: Connected to Supabase, double funnel (Lead Magnet + Calendly).
  2. **Media Optimization**: Real photos/videos, WebP conversion, lazy loading, video background.
  3. **Responsive Layout**: Editorial magazine style, 5 high-impact sections.
  4. **Scroll Animations**: Strict requirement for `framer-motion` for premium, smooth scroll reveals and page transitions.
- Target output file for the worker: `tests/e2e/tier2.spec.ts`.
- Current source code in `app/page.tsx` appears to be a generic Next.js template, implying tests should be written in a decoupled, requirement-driven manner.

## 2. Logic Chain
To fulfill the Tier 2 requirements, I am defining 5 boundary/corner case tests per feature:

### Feature 1: Lead Generation Form (Boundary & Security)
- **Test 1.1**: *XSS & SQLi Payload Rejection* - Submitting fields containing `<script>alert(1)</script>` or `' OR 1=1 --` should be safely sanitized or rejected without execution.
- **Test 1.2**: *Extreme String Lengths* - Submitting an email of 255+ characters and name of 100+ characters to test database/field boundaries.
- **Test 1.3**: *Malformed Edge Cases* - Submitting boundary emails like `test@.com`, `test@domain`, or just spaces `   `.
- **Test 1.4**: *Network Timeout Simulation* - Using Playwright network routing to intercept and abort/timeout the Supabase POST request, ensuring the UI degrades gracefully (shows an error message, no crash).
- **Test 1.5**: *Rapid Double Submission* - Emitting multiple rapid click events on the submit button to verify debouncing or button-disabled state to prevent duplicate database entries.

### Feature 2: Media Optimization (Network & Media Boundaries)
- **Test 2.1**: *Hero Video Fallback* - Intercepting and blocking `.mp4`/`.webm` requests to verify if a fallback image/poster or background color is displayed without layout collapse.
- **Test 2.2**: *Image Lazy Loading Boundaries* - Verifying images in the Portfolio section (below the fold) are NOT requested on initial load, but are requested precisely when scrolling past the 30% viewport boundary.
- **Test 2.3**: *Extreme Aspect Ratio Object-Fit* - Changing viewport to an extreme panoramic (e.g. 3000x500) and extreme vertical (e.g. 500x3000) to ensure the hero video does not stretch or break out of its container.
- **Test 2.4**: *Unsupported WebP Fallback* - Simulating a browser that does not accept `image/webp` in the `Accept` header (if possible via CDP/headers) to ensure jpeg/png fallbacks are loaded.
- **Test 2.5**: *High-DPI Display Limits* - Emulating a `deviceScaleFactor: 3` (Retina) and verifying `srcset` attributes request higher resolution assets instead of standard ones.

### Feature 3: Responsive Layout & Sections (Viewport Extremes)
- **Test 3.1**: *Ultra-Narrow Viewport* - Emulating iPhone SE (320px width) and asserting `document.documentElement.scrollWidth === window.innerWidth` (no horizontal scrolling/overflow).
- **Test 3.2**: *Orientation Swap Mid-Session* - Emulating a tablet in portrait, scrolling halfway, then switching to landscape to verify the layout (especially the asymmetric gallery) recalculates correctly without visual breakage.
- **Test 3.3**: *Ultra-Wide Bounding* - Emulating a 4K screen (3840px width) to ensure the main content container respects a `max-width` constraint and stays centered, rather than stretching infinitely.
- **Test 3.4**: *200% Font Scaling Override* - Emulating user accessibility font-size increase and verifying that text in "Il Metodo" does not overlap or spill outside its container.
- **Test 3.5**: *Mobile Touch Target Sizing* - Verifying that the primary CTA and form inputs have bounding boxes with a minimum height/width of 44px for accessibility compliance on mobile viewports.

### Feature 4: Scroll Animations (Framer-Motion Corner Cases)
- **Test 4.1**: *Prefers-Reduced-Motion Override* - Setting `page.emulateMedia({ reducedMotion: 'reduce' })` and verifying elements appear instantly without translation/delay thresholds.
- **Test 4.2**: *Rapid Scroll Thrashing* - Scrolling from top to bottom and back to top within 1 second; verifying animations do not queue infinitely or freeze the page.
- **Test 4.3**: *Viewport Resize During Animation* - Resizing the window while an element is mid-transition to ensure framer-motion recalculates the transform correctly without leaving elements off-screen.
- **Test 4.4**: *Partial Visibility Threshold* - Scrolling exactly 1 pixel into the trigger zone of an animated element, stopping, and verifying the animation fires (testing the `amount` threshold accuracy).
- **Test 4.5**: *JavaScript Disabled Fallback* - Disabling JS in the context and verifying that content is still visible (opacity: 1) via SSR, rather than being stuck at opacity 0 waiting for framer-motion to hydrate.

## 3. Caveats
- The source code currently contains the generic Next.js boilerplate. The test implementation will need to use predictable, requirement-driven selectors (e.g. `getByRole('form')`, `getByPlaceholder('Email')`, `locator('video')`, `getByText('Il Metodo')`) which the UI implementer will later need to match.
- Network interception for Supabase assumes REST/fetch. If the Supabase client uses WebSockets (less likely for simple inserts), different interception may be needed.
- Some tests like 200% font scaling might be complex to emulate perfectly in Playwright without injecting custom CSS, but Playwright can manipulate CSS variable bases or body font-size.

## 4. Conclusion
The Tier 2 test plan is complete, providing 20 rigorous boundary and corner cases evenly distributed across the 4 core features. A worker should take these definitions and implement them into `tests/e2e/tier2.spec.ts`.

## 5. Verification Method
- **Implementation Check**: Verify `tests/e2e/tier2.spec.ts` is created and contains exactly 20 test blocks corresponding to this plan.
- **Syntax & Execution**: Run `npx playwright test tests/e2e/tier2.spec.ts`. They will likely fail (as the UI is not built), but the tests must compile without syntax errors and correctly attempt their specific boundary logic (like network routing, viewport emulation, and reduced motion settings).
