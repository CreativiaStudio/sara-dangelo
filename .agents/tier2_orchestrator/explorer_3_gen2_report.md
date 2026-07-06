# Tier 2 E2E Test Implementation Plan (ITERATION 2)

## 1. Observation
- The auditor found that the previous `tier2.spec.ts` test suite contained integrity violations: tests used conditional wrappers (`if (await locator.count() > 0)`) that allowed tests to silently pass if target elements were absent, and hardcoded `return true;` in the contrast test.
- The requirements specify generating >= 5 boundary/corner-case tests for each of the 4 features, focusing on responsive sizes, absence of pure black, and form error inputs, ensuring NO silent passes or hardcoded assertions.

## 2. Logic Chain
- To fix the facade tests, every planned test will strictly require unconditional assertions (e.g., `await expect(locator).toBeVisible()` or `expect(await locator.count()).toBeGreaterThan(0)`) before any property evaluations. This ensures tests fail if elements are not found.
- To fix the hardcoded contrast test, the test will locate an actual foreground element, retrieve its computed foreground and background colors, parse the RGB values, and compute the WCAG relative luminance and contrast ratio.
- I have outlined exactly 20 tests (5 per feature). Each test is designed to test a boundary or corner case (extreme viewports, strict color requirements, form validation boundaries).

## 3. Caveats
- Since the implementation code might not exist yet or we are only planning, locators described in the plan (e.g., `[data-testid="contact-form"]`) are assumptions. The implementer must adjust locators to match the actual DOM.
- Real contrast ratio calculation requires a custom mathematical function injected into the page via `evaluate()` since Playwright does not have native contrast ratio assertions.

## 4. Conclusion
- A robust, strict 20-test plan is defined. It strictly mandates unconditional existence assertions for all tested elements and realistic evaluation logic.

## 5. Verification Method
- Review `tests/e2e/tier2.spec.ts` (once implemented by the next agent) to verify no `if (await locator.count() > 0)` wrappers exist around assertions.
- Verify that `expect(true).toBeTruthy()` or hardcoded `return true;` are absent, particularly in the contrast test.
- Run `npx playwright test tests/e2e/tier2.spec.ts` to ensure it fails if elements are missing, rather than silently passing.

---

## Detailed Test Plan (>= 5 Boundary/Corner-case Tests per Feature)

### Feature 1: High Fashion Layout & Palette (NO BLACK)
1. **Test 1.1: No pure black in text typography**
   - **Logic**: Unconditionally locate all typography elements (`p, h1, h2, h3, h4, h5, h6, span, a`). Assert `await expect(elements.first()).toBeVisible()`. Iterate over elements, extract `getComputedStyle(el).color`, and assert it is not `rgb(0, 0, 0)`.
2. **Test 1.2: No pure black in section backgrounds**
   - **Logic**: Unconditionally locate all structural elements (`div, section, main, header, footer`). Assert `await expect(elements.first()).toBeVisible()`. Extract `getComputedStyle(el).backgroundColor` and assert it is not `rgb(0, 0, 0)`.
3. **Test 1.3: Responsive layout at extreme ultrawide width (3840px)**
   - **Logic**: Set viewport to 3840x1080. Unconditionally locate the main content wrapper (e.g., `main`). Assert `await expect(wrapper).toBeVisible()`. Evaluate its computed width and assert it is appropriately constrained (e.g., `< 3840px` and centered via margins).
4. **Test 1.4: Responsive layout at extreme narrow width (320px) - No horizontal scroll**
   - **Logic**: Set viewport to 320x568. Unconditionally locate the `body` or `html`. Evaluate `document.documentElement.scrollWidth`. Assert it is exactly equal to the viewport width (no horizontal overflow).
5. **Test 1.5: Accessibility contrast ratio for primary CTA**
   - **Logic**: Unconditionally locate the primary CTA button. Assert `await expect(cta).toBeVisible()`. Evaluate its `color` and `backgroundColor`. Implement the real WCAG relative luminance formula in `page.evaluate()` to calculate the exact contrast ratio. Assert the ratio is `>= 3` (for large text) or `>= 4.5` (for normal text). NO HARDCODING.

### Feature 2: Scrollytelling Animations
1. **Test 2.1: Very fast scrolling reveals elements**
   - **Logic**: Scroll to the very bottom of the page in one tick. Unconditionally locate an element that animates on scroll near the footer. Assert `await expect(el).toBeVisible()`. Wait for animation. Assert its computed `opacity` is `1`.
2. **Test 2.2: Reverse scrolling persistence**
   - **Logic**: Scroll down to reveal a mid-page animated section. Unconditionally locate it. Assert `await expect(el).toBeVisible()`. Scroll back to the top, then scroll down again. Assert the element remains visible and does not break into an intermediate hidden state.
3. **Test 2.3: Initial load above-the-fold visibility without scrolling**
   - **Logic**: Load the page without scrolling. Unconditionally locate the hero section headline. Assert `await expect(hero).toBeVisible()`. Evaluate its opacity. Assert it is `1` (should not be stuck at 0 waiting for a scroll event that already happened).
4. **Test 2.4: Window resize during scrollytelling**
   - **Logic**: Scroll halfway down to trigger an animation. Unconditionally locate the animating element. Immediately change viewport size to mobile. Assert the element remains `toBeVisible()` and is rendered within the viewport dimensions (no layout breakage).
5. **Test 2.5: Respects prefers-reduced-motion**
   - **Logic**: Set Playwright context to emulate `prefers-reduced-motion: reduce`. Load page and scroll. Unconditionally locate animated elements. They should appear instantly. Assert their `opacity` is `1` and `transform` is `none` without waiting for animation durations.

### Feature 3: Media Display & Typography
1. **Test 3.1: Typography scaling at mobile boundary (320px)**
   - **Logic**: Set viewport to desktop. Unconditionally locate the main `h1`. Assert `await expect(h1).toBeVisible()`. Record its computed `font-size`. Switch viewport to 320px. Record `font-size` again. Assert the mobile font-size is strictly less than the desktop font-size.
2. **Test 3.2: Missing image fallback handling**
   - **Logic**: Intercept network requests and abort requests to the hero image (`**/*.webp` or `**/*.jpg`). Reload page. Unconditionally locate the image or its container. Assert `await expect(imgContainer).toBeVisible()`. Assert its computed `height` is greater than 0, ensuring the layout didn't completely collapse.
3. **Test 3.3: Extreme aspect ratio preservation (300x1000)**
   - **Logic**: Set viewport to 300x1000. Unconditionally locate a primary image. Assert `await expect(img).toBeVisible()`. Extract its `object-fit` CSS property and assert it is `cover` (or verify that its displayed aspect ratio prevents distortion).
4. **Test 3.4: Video element attributes for mobile auto-play**
   - **Logic**: Unconditionally locate the background video element. Assert `await expect(video).toBeVisible()`. Assert it has the `muted`, `playsinline`, and `loop` attributes, which are strictly required for auto-play across mobile browsers.
5. **Test 3.5: Extremely long text overflow boundary**
   - **Logic**: Unconditionally locate a paragraph element. Assert `await expect(p).toBeVisible()`. Use Playwright to forcibly set its innerText to 5000 characters of unbroken string (e.g. `A`.repeat(5000)). Assert that its computed width does not exceed the viewport width (meaning `overflow-wrap: break-word` or similar is active).

### Feature 4: Lead Generation & CTA
1. **Test 4.1: Form submission with completely empty fields**
   - **Logic**: Unconditionally locate the form and submit button. Assert both `toBeVisible()`. Click submit. Assert that an HTML5 validation message is triggered (e.g., checking `element.validity.valueMissing`) or an explicit error text element becomes visible.
2. **Test 4.2: Form submission with strictly invalid email**
   - **Logic**: Unconditionally locate the email input. Assert `await expect(emailInput).toBeVisible()`. Fill it with `invalid-email-no-domain`. Click submit. Unconditionally assert that the form is not submitted (intercept network to ensure no Supabase call is made) and an error is displayed.
3. **Test 4.3: Extreme input lengths**
   - **Logic**: Unconditionally locate the name input. Assert `await expect(nameInput).toBeVisible()`. Fill with a 500-character string. Evaluate the input value. If the input has a `maxlength` attribute, assert the value length is strictly equal to the `maxlength`. Otherwise, attempt submit and assert network rejection or client-side error.
4. **Test 4.4: Rapid double submission prevention**
   - **Logic**: Intercept Supabase API calls. Unconditionally locate the form and fill it with valid data. Locate submit button. Assert `await expect(btn).toBeVisible()`. Call `.click()` 5 times rapidly. Assert that the network interception captured exactly ONE request, or that the button becomes `disabled` after the first click.
5. **Test 4.5: Calendly CTA external link boundary**
   - **Logic**: Unconditionally locate the Calendly CTA link. Assert `await expect(calendlyBtn).toBeVisible()`. Assert that its `href` attribute strictly starts with `https://calendly.com/`. Assert that its `target` attribute is `_blank` to ensure it doesn't navigate away from the current tab.
