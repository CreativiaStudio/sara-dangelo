# Handoff Report: Tier 2 E2E Test Plan (Iteration 2)

1. **Observation**:
   - The previous test suite (`tests/e2e/tier2.spec.ts`) failed a forensic audit because it utilized "facade testing" patterns: specifically, hardcoded returns (e.g., `return true` in the contrast test) and structural bypasses (e.g., wrapping assertions in `if (await locator.count() > 0)` blocks).
   - As outlined in `TEST_INFRA.md` and `SCOPE.md`, the Tier 2 suite must evaluate 4 key features with at least 5 boundary/corner-case tests each (total >= 20 tests).
   - Expected boundaries include responsive scaling, absence of pure black, and error input validation.

2. **Logic Chain**:
   - To resolve the Integrity Violation, the new test plan must explicitly forbid conditional assertions. Every test must begin with a strict assertion of element existence (e.g., `await expect(locator).toBeVisible()` or `expect(await locator.count()).toBeGreaterThan(0)`).
   - If an element is missing, the test *must* fail, accurately reflecting a broken DOM or missing feature.
   - For the accessibility contrast test, the test must retrieve the computed color values, parse them into RGB components, and mathematically evaluate the contrast ratio (relative luminance) instead of hardcoding a boolean.
   - I have designed 20 robust tests across the 4 core features, ensuring comprehensive coverage of layout constraints, animation handling, media edge cases, and form validation limits.

3. **Caveats**:
   - As an Explorer, I am only providing the *plan* for these tests. The implementer will need to translate the described mathematical functions (e.g., relative luminance for contrast) into Playwright `evaluate()` blocks.
   - The exact locators (e.g., `.animate-on-scroll`, `input[type="email"]`) might need slight adjustments by the implementer based on the actual DOM of the application, but the *assertions* must remain unconditional.

4. **Conclusion**:
   - The test plan is complete and addresses all audit violations. By mandating explicit existence checks and mathematical verification, the resulting test suite will provide genuine verification of the application's boundary conditions.
   - See the detailed test plan below.

5. **Verification Method**:
   - **For the Implementer**: Review the planned tests below. Implement them exactly as described, ensuring NO `if (await locator.count() > 0)` blocks are used.
   - **For the Auditor**: Execute `npx playwright test tests/e2e/tier2.spec.ts`. Open the test file and perform a string search for `if (await` and `return true`. There should be zero occurrences.

---

## Detailed Test Plan

### Feature 1: High Fashion Layout & Palette
*Focus: Responsive constraints, palette boundaries (no black).*

1. **Test 1.1: Absolute absence of pure black (RGB/Hex boundary)**
   - **Logic**: Use `await page.waitForLoadState('networkidle')`. Check all elements `document.querySelectorAll('*')`. Extract `color`, `backgroundColor`, and `borderColor`. 
   - **Assertion**: Return an array of violating elements. `expect(violatingElements).toEqual([])`. No hardcoded booleans.
2. **Test 1.2: Extreme mobile viewport (320px width) - Horizontal Overflow**
   - **Logic**: Set viewport to 320x568. 
   - **Assertion**: Evaluate `document.documentElement.scrollWidth === document.documentElement.clientWidth`. `expect(hasOverflow).toBeFalsy()`.
3. **Test 1.3: Ultra-wide display (3840px width) - Max-width constraint**
   - **Logic**: Set viewport to 3840x2160. Locate the main wrapper `page.locator('main').first()`. 
   - **Assertion**: **Explicitly assert** `await expect(mainContainer).toBeVisible()`. Retrieve computed width and `expect(width).toBeLessThan(3840)`.
4. **Test 1.4: Browser Zoom at 200% - Typography overflow**
   - **Logic**: Apply `transform: scale(2)` to `document.body`. Locate all `h1, p` elements. 
   - **Assertion**: **Explicitly assert** `expect(await textElements.count()).toBeGreaterThan(0)`. Iterate through each and `expect(scrollWidth <= clientWidth)` to ensure text doesn't spill out of its container.
5. **Test 1.5: Accessibility contrast ratios - Mathematical Verification**
   - **Logic**: Locate the `h1` and `body` or `main` elements. **Explicitly assert** they exist. Inside `page.evaluate`, retrieve the computed text color and background color. Calculate the Relative Luminance (L1 and L2) using standard WCAG formulas. 
   - **Assertion**: Calculate the contrast ratio `(L1 + 0.05) / (L2 + 0.05)`. `expect(ratio).toBeGreaterThanOrEqual(4.5)`. **DO NOT hardcode return true**.

### Feature 2: Scrollytelling Animations
*Focus: Scroll boundary limits, prefers-reduced-motion.*

1. **Test 2.1: Prefers-reduced-motion (System boundary)**
   - **Logic**: Start test with `test.use({ reducedMotion: 'reduce' })`. Locate the first hero animation element (e.g., `[data-testid="animated-section"]`). 
   - **Assertion**: **Explicitly assert** `await expect(element).toBeVisible()`. Evaluate its `opacity` and `expect(opacity).toBe('1')` immediately, proving animations are bypassed.
2. **Test 2.2: Extreme rapid scroll to bottom**
   - **Logic**: Use `window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })`. Locate the final animated section. 
   - **Assertion**: **Explicitly assert** `await expect(finalSection).toBeVisible()`. Verify its CSS opacity goes above 0 or reaches 1 within standard timeout limits.
3. **Test 2.3: Interrupted animation via responsive resize**
   - **Logic**: Set viewport 1440px. Scroll by 500px to trigger animation. Instantly resize viewport to 375px. Locate the animated element. 
   - **Assertion**: **Explicitly assert** `await expect(animatedElement).toBeVisible()`. Verify its bounding box width `expect(box.width).toBeLessThanOrEqual(375)` to prove layout didn't break mid-animation.
4. **Test 2.4: Immediate scroll reversal (Yoyo effect)**
   - **Logic**: Scroll down 800px, wait 50ms, scroll up -800px immediately. Locate the target section. 
   - **Assertion**: **Explicitly assert** `await expect(element).toBeVisible()`. Verify it returns to initial state without errors (e.g., opacity matches initial load state).
5. **Test 2.5: CLS (Cumulative Layout Shift) threshold during scroll**
   - **Logic**: Scroll through the page while capturing `window.performance.getEntriesByType('layout-shift')`. 
   - **Assertion**: Calculate total CLS score and `expect(clsScore).toBeLessThan(0.1)` to guarantee animations do not physically shift the layout structure out of bounds.

### Feature 3: Media Display & Typography
*Focus: Broken media boundaries, typography extremes.*

1. **Test 3.1: Image load failures (Network boundary)**
   - **Logic**: Use `await page.route('**/*.{png,jpg,jpeg,webp}', route => route.abort())`. Reload page. Locate hero images. 
   - **Assertion**: **Explicitly assert** `expect(await images.count()).toBeGreaterThan(0)`. Verify `alt` text is present and image bounding box retains a non-zero height (preventing layout collapse).
2. **Test 3.2: Extremely long typography strings (Overflow check)**
   - **Logic**: Locate the primary `h1`. **Explicitly assert** `await expect(h1).toBeVisible()`. Overwrite its text with `'A'.repeat(500)`. 
   - **Assertion**: Verify `scrollWidth <= clientWidth` to guarantee `overflow-wrap: break-word` or `word-break` CSS is correctly applied.
3. **Test 3.3: Video autoplay limits (Low Power / Autoplay blocked)**
   - **Logic**: Locate `video` element. **Explicitly assert** `expect(await video.count()).toBeGreaterThan(0)`. 
   - **Assertion**: Verify it has `playsinline` and `muted` attributes so it degrades gracefully. `expect(isMuted).toBeTruthy()`.
4. **Test 3.4: Extreme user base font size**
   - **Logic**: Force root font size to 32px (`document.documentElement.style.fontSize = '32px'`). Locate a key text block. 
   - **Assertion**: **Explicitly assert** `await expect(textBlock).toBeVisible()`. Verify text elements don't overflow their direct parent's bounding box.
5. **Test 3.5: Missing glyphs / Unicode edge cases**
   - **Logic**: Locate the first paragraph (`p`). **Explicitly assert** `await expect(p).toBeVisible()`. Inject complex unicode `こんにちは 🌍 \u0000 \uFFFD`. 
   - **Assertion**: Ensure the element's bounding box height remains > 0 and no JS errors are thrown in the console.

### Feature 4: Lead Generation & CTA
*Focus: Form validation limits, network request boundaries.*

1. **Test 4.1: Whitespace-only submission (Validation boundary)**
   - **Logic**: Locate name input, email input, and submit button. **Explicitly assert** `await expect(nameInput).toBeVisible()`, etc. Fill with `'   '`. Click submit. 
   - **Assertion**: Verify the browser blocks submission natively (`expect(validity.valid).toBeFalsy()`) or an explicit error locator becomes visible.
2. **Test 4.2: Malformed email boundaries**
   - **Logic**: Locate email input and button. **Explicitly assert** visibility. Fill with `double@@domain.com`. 
   - **Assertion**: Click submit and assert the field is flagged invalid by native validation. `expect(await emailInput.evaluate(e => e.validity.valid)).toBe(false)`.
3. **Test 4.3: XSS payload input (Sanitization boundary)**
   - **Logic**: Locate form. **Explicitly assert** it exists. Fill inputs with `<script>alert(1)</script>`. Submit. 
   - **Assertion**: Attach a dialog listener. `expect(dialogTriggered).toBeFalsy()`. Form submission should fail validation or sanitize the payload.
4. **Test 4.4: Rapid double submission (Debounce boundary)**
   - **Logic**: Locate form elements. **Explicitly assert** visibility. Fill with valid test data. Locate submit button. Loop `click({ force: true })` 10 times rapidly. 
   - **Assertion**: Intercept network requests to the Supabase endpoint. `expect(postRequestCount).toBeLessThanOrEqual(1)`.
5. **Test 4.5: Calendly redirect loaded**
   - **Logic**: Locate the main Calendly CTA button. **Explicitly assert** `await expect(calendlyBtn).toBeVisible()`. Click it. 
   - **Assertion**: Await page load state or popup window. `expect(page.url()).toContain('calendly.com')` or `expect(popup.url()).toContain('calendly.com')`. No conditional checks for "if button exists".
