# Tier 2 E2E Tests Plan (Boundary & Corner Cases)

## Observation
- **`TEST_INFRA.md`** requires E2E tests utilizing Playwright with coverage for 4 features, specifying Tier 2 needs >= 5 boundary & corner case tests per feature.
- **`SCOPE.md`** mandates the creation of `tier2.spec.ts` addressing these features with a focus on responsive sizes, absence of pure black, and form error inputs. No actual execution is needed, just generating the test logic structure.

## Logic Chain
Based on the feature descriptions, the boundary/corner-case considerations are defined as follows:

### Feature 1: High Fashion Layout & Palette
*Focus: Absence of pure black, extreme viewport dimensions, accessibility contrast.*
1. **Test 1.1: Absolute absence of pure black.** Traverse the DOM tree and assert that `window.getComputedStyle` does not yield `rgb(0, 0, 0)`, `rgba(0, 0, 0, 1)`, or `#000000` for color, background-color, or border-color properties.
2. **Test 1.2: Extra-small mobile viewport (320px width).** Render page at 320x568 (e.g., iPhone SE). Verify no horizontal scrollbars exist and flex/grid containers wrap correctly.
3. **Test 1.3: Ultra-wide display (3840px width).** Render page at 4k resolution. Assert that the main container content does not stretch indefinitely but respects a central max-width bound.
4. **Test 1.4: Browser Zoom at 200%.** Apply viewport scaling to 200%. Assert that text does not overflow its bounding boxes and remains fully readable.
5. **Test 1.5: Accessibility contrast ratios.** Test contrast ratios of the limited palette (beige/gold/brown/white) to ensure that the combination of text and background colors passes WCAG AA minimum thresholds at boundary values.

### Feature 2: Scrollytelling Animations
*Focus: Extreme scrolling speeds, user accessibility preferences, viewport edge cases.*
1. **Test 2.1: Prefers-reduced-motion.** Emulate `prefers-reduced-motion: reduce`. Verify that Framer Motion animations instantly complete (or are disabled) and all content is immediately visible.
2. **Test 2.2: Extreme rapid scroll to bottom.** Scroll from `scrollY=0` to `document.body.scrollHeight` in <100ms. Assert that all final states of animated elements are visible and nothing is left at `opacity: 0`.
3. **Test 2.3: Interrupted animation via resize.** Trigger an animation by scrolling to an element, then immediately resize the window from desktop to mobile. Assert the element reflows correctly without getting stuck mid-transition.
4. **Test 2.4: Immediate scroll reversal (Yoyo effect).** Scroll down to trigger an element's appearance, then immediately scroll up before the animation finishes. Assert the element handles the exit/re-entry gracefully without flickering.
5. **Test 2.5: Bottom edge threshold.** Validate the last animated section on the page. Assert that it is fully revealed even if the user cannot scroll further down (intersection observer margin bounds).

### Feature 3: Media Display & Typography
*Focus: Broken media, extreme text lengths, unsupported environments.*
1. **Test 3.1: Image load failures.** Intercept network requests for WebP images and abort them. Assert that fallback alt text or placeholder is displayed without breaking the page layout structure.
2. **Test 3.2: Extremely long typography strings.** Inject a 500-character unbroken string into a serif title. Assert that CSS `word-break` or `overflow-wrap` applies, preventing horizontal overflow off the screen.
3. **Test 3.3: Video autoplay blocked.** Emulate a browser policy blocking autoplay (or Low Power Mode). Assert the UI shows the video's poster image gracefully and layout holds.
4. **Test 3.4: Extreme user base font size.** Inject a `32px` base font size on the `<html>` element. Assert that the typography components scale proportionally (using `rem`) without overlapping text lines.
5. **Test 3.5: Missing glyphs / Special characters.** Inject non-standard unicode characters and emojis into descriptions. Assert they render properly or fallback smoothly without breaking the container bounds.

### Feature 4: Lead Generation & CTA
*Focus: Error inputs, rapid interactions, network edge cases.*
1. **Test 4.1: Whitespace-only submission.** Input only space characters (`"   "`) into required name/email fields. Assert the form fails validation and displays required field error messages.
2. **Test 4.2: Malformed email boundaries.** Input boundary emails (`missing-at-sign.com`, `trailing@`, `double@@domain.com`). Assert UI rejects them immediately via client-side validation.
3. **Test 4.3: XSS / SQLi payload inputs.** Input payloads like `<script>alert(1)</script>` into the fields. Submit the form. Assert no execution occurs and the UI handles the string safely.
4. **Test 4.4: Rapid double submission (Debounce check).** Click the "Submit" button 10 times in 500ms. Assert the button enters a disabled/loading state on the first click and only ONE network request is dispatched.
5. **Test 4.5: Calendly redirect interception.** Mock a network failure or blocked popup for the Calendly CTA redirect. Assert the application provides a visible error fallback or alternative contact method.

## Caveats
- Playwright tests are planned logic structures only; implementation may require specific DOM selectors (`data-testid`) not detailed here.
- The "No pure black" test requires evaluating computed styles in the browser context, which can sometimes miss inline SVGs or external iframes unless explicitly scoped.

## Conclusion
The planned `tier2.spec.ts` file will systematically validate the boundaries and corner cases for the Sara D'Angelo Landing Page. With 20 distinct scenarios (5 per feature), we ensure coverage across extreme viewport constraints, animation bounds, media failures, and form input errors.

## Verification Method
- Inspect the generated plan above to ensure all 4 features have exactly 5 tests.
- Verify tests emphasize corner cases: responsive widths, pure black absence, network interceptions, and malformed inputs.
