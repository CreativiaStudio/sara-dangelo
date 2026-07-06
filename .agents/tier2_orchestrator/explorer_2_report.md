# Handoff Report: Tier 2 E2E Boundary Tests Plan

## 1. Observation
- Read `TEST_INFRA.md`: Identified the 4 core features of the Sara D'Angelo Landing Page:
  1. High Fashion Layout & Palette
  2. Scrollytelling Animations
  3. Media Display & Typography
  4. Lead Generation & CTA
- Read `SCOPE.md` in `tier2_orchestrator`: Identified the requirements for `tests/e2e/tier2.spec.ts`.
- Key constraints observed:
  - Provide exactly >= 5 boundary/corner-case tests for EACH of the 4 features (Total 20 tests).
  - Focus specifically on responsive sizes, absolute absence of pure black (`rgb(0,0,0)` or `#000`), and error inputs in forms.
  - No Playwright test execution required, just the structured plan and logic.

## 2. Logic Chain
To satisfy the requirements, the following test plan has been devised to aggressively validate boundaries, utilizing Playwright's browser context emulation, network interception, and DOM evaluation capabilities:

### Feature 1: High Fashion Layout & Palette (Focus: No Black, Responsive)
1. **Test**: `Feature 1.1: Desktop pure black absence sweep`
   - *Logic*: Evaluate all computed styles of DOM nodes on a large desktop viewport (1920x1080) to ensure absolutely no `color`, `background-color`, or `border-color` computes to `rgb(0, 0, 0)`.
2. **Test**: `Feature 1.2: Mobile pure black absence sweep`
   - *Logic*: Repeat the exact pure black sweep on an ultra-narrow mobile viewport (320px) to catch mobile-specific navigation/drawer components that might default to black.
3. **Test**: `Feature 1.3: Layout integrity on ultra-wide screens`
   - *Logic*: Emulate an ultra-wide viewport (3840x1080) and assert that the layout remains bounded or scales correctly with brand colors, preventing unstyled HTML black backgrounds from showing at the edges.
4. **Test**: `Feature 1.4: Dynamic orientation flip handling`
   - *Logic*: Change viewport dynamically from landscape (1024x768) to portrait (768x1024) while evaluating that CSS Grid/Flex structures do not collapse or cause text overlapping.
5. **Test**: `Feature 1.5: Contrast ratio verification on non-black text`
   - *Logic*: Select prominent typography elements and verify that the computed dark brown/gold colors achieve a readable contrast ratio (>= 4.5:1) against the cream/beige backgrounds.

### Feature 2: Scrollytelling Animations (Focus: Transitions & States)
1. **Test**: `Feature 2.1: Reverse rapid scroll trigger check`
   - *Logic*: Scroll immediately to the bottom of the page, bypassing initial loading states, then scroll back up to ensure animations trigger correctly in reverse and elements do not remain locked in hidden states.
2. **Test**: `Feature 2.2: Reduced motion preference enforcement`
   - *Logic*: Emulate `@media (prefers-reduced-motion: reduce)` and assert that framer-motion scroll-reveals instantly snap to opacity 1 / translate 0 rather than executing transitions.
3. **Test**: `Feature 2.3: Extremely short viewport scroll thresholds`
   - *Logic*: Set viewport height to 400px (shorter than most sections) and verify that scroll triggers still correctly fire based on intersection ratio thresholds, making content visible.
4. **Test**: `Feature 2.4: Window resize during active animation`
   - *Logic*: Trigger an animation via scroll, and within 100ms aggressively resize the window (from 1920px to 320px). Verify that the final DOM state recovers without layout distortion.
5. **Test**: `Feature 2.5: Zoom level boundary rendering`
   - *Logic*: Emulate 200% browser zoom or equivalent scaling, asserting that scrollytelling thresholds still accurately intersect and elements do not remain permanently off-screen.

### Feature 3: Media Display & Typography (Focus: Fallbacks & Extremes)
1. **Test**: `Feature 3.1: Font service failure layout retention`
   - *Logic*: Block network requests to external font services. Assert that the fallback `serif` and `sans-serif` fonts apply properly and the design grid doesn't catastrophically shift.
2. **Test**: `Feature 3.2: Network stall on video/media assets`
   - *Logic*: Simulate a network stall for video/image assets. Assert that WebP/JPEG poster fallbacks are visible and the container maintains its aspect ratio instead of collapsing.
3. **Test**: `Feature 3.3: Excessive unbroken string injection`
   - *Logic*: Inject a massive unbroken string ("SARA_DANGELO_EXTRAVAGANZA_2026_COLLECTION") into the DOM on a 320px viewport and assert that `word-break` or `overflow-wrap` prevents horizontal scrolling.
4. **Test**: `Feature 3.4: Line-height descender clipping on mobile`
   - *Logic*: Evaluate multiline serif typography on a mobile viewport and calculate the bounding boxes of lines to ensure descenders (like 'g', 'j') do not visually clip into the line below them.
5. **Test**: `Feature 3.5: Extreme aspect ratio image boundaries`
   - *Logic*: Use Playwright request interception to return extreme image aspect ratios (1x1000px and 1000x1px) and ensure `object-fit: cover` properly constraints them within the layout without breaking the grid.

### Feature 4: Lead Generation & CTA (Focus: Form Errors & Integrations)
1. **Test**: `Feature 4.1: Empty submission rejection`
   - *Logic*: Click submit on a completely empty form and assert that client-side required field validation messages appear instantly without triggering a network request to Supabase.
2. **Test**: `Feature 4.2: Malicious string (SQLi/XSS) input rejection`
   - *Logic*: Input `' OR 1=1 --` and `<script>alert(1)</script>` into the email and name fields. Verify the form triggers a validation error and/or sanitizes the input before attempting submission.
3. **Test**: `Feature 4.3: Excessively long input boundary`
   - *Logic*: Type 10,000 characters into the text fields. Assert that HTML `maxlength` boundaries are respected or the browser doesn't freeze, preventing submission of massive payloads.
4. **Test**: `Feature 4.4: Rapid multi-click throttling`
   - *Logic*: Click the form submission button 10 times consecutively within 100ms. Assert that only exactly 1 network request is dispatched to prevent duplicate database entries.
5. **Test**: `Feature 4.5: Calendly redirect bypass on 500 server error`
   - *Logic*: Intercept the form submission network request and return an HTTP 500 error from Supabase. Assert that the user is explicitly NOT redirected to Calendly and a graceful error banner is shown instead.

## 3. Caveats
- No actual Playwright execution took place as per the "No actual Playwright test execution will be done" constraint.
- The locator targets (e.g., buttons, form fields) are assumed to use standard semantic HTML or roles, but their exact selectors will depend on the final UI implementation. The implementer must adjust selectors appropriately.

## 4. Conclusion
The implementation plan for `tests/e2e/tier2.spec.ts` is fully defined, providing 20 rigorous tests covering edge-cases, network anomalies, extreme viewport dimensions, input abuse, and strict adherence to the absolute "no black color" rule. This plan provides the blueprint for the implementer agent.

## 5. Verification Method
1. The implementer reads this report and translates it into `tests/e2e/tier2.spec.ts`.
2. To verify the plan is working, run: `npx playwright test tests/e2e/tier2.spec.ts`
3. All 20 tests must execute and pass with exit code 0.
