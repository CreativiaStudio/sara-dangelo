# Implementation Plan: Tier 2 E2E Tests (`tests/e2e/tier2.spec.ts`)

## Context & Integrity Requirements
This plan addresses the forensic audit findings that flagged the previous test implementation for "Facade Testing" and "Hardcoded Outputs". 

**Strict Rules for Implementation:**
1. **No Conditional Facades:** Tests MUST NOT use conditional checks like `if (await locator.count() > 0)` to wrap assertions. Every test MUST explicitly assert the presence of required elements using `await expect(locator).toBeVisible()` or `expect(await locator.count()).toBeGreaterThan(0)` before checking properties. If an expected element is missing, the test MUST fail.
2. **No Hardcoded Values:** Complex evaluations (like contrast ratio) MUST calculate actual values using real data from the DOM, instead of returning hardcoded truthy values (`return true;`).
3. **Focus:** Boundary and corner cases across the 4 key features (minimum 5 tests per feature).

---

## Planned Tests

### Feature 1: High Fashion Layout & Palette
**Goal:** Test boundary constraints for layout dimensions and absolute color restrictions (NO BLACK).

*   **Test 1.1: Mobile viewport layout constraint (No horizontal overflow)**
    *   *Logic:* Set viewport to 320x480. Assert `body` is visible. Evaluate `document.documentElement.scrollWidth` and assert it is strictly equal to the viewport width (320), verifying no elements break out horizontally.
*   **Test 1.2: Ultra-wide layout centering constraint**
    *   *Logic:* Set viewport to 3840x2160. Locate the main content container. Assert `await expect(mainContainer).toBeVisible()`. Evaluate the `max-width` and `margin` to ensure it is bounded and centered on ultra-wide screens.
*   **Test 1.3: Absolute absence of pure black (#000000) in text**
    *   *Logic:* Locate all text elements (headings, paragraphs). **Assert:** `expect(await textElements.count()).toBeGreaterThan(0)`. Iterate through all text elements, evaluate their `window.getComputedStyle(el).color`, and assert `expect(color).not.toBe('rgb(0, 0, 0)')`.
*   **Test 1.4: Absolute absence of pure black in backgrounds**
    *   *Logic:* Locate all container elements (`div`, `section`, `header`, `footer`). **Assert:** `expect(await containers.count()).toBeGreaterThan(0)`. Iterate through containers, evaluate `window.getComputedStyle(el).backgroundColor`, and assert `expect(bgColor).not.toBe('rgb(0, 0, 0)')` and `not.toBe('rgba(0, 0, 0, 1)')`.
*   **Test 1.5: Accessibility contrast ratios (Real Calculation)**
    *   *Logic:* Locate primary CTA buttons and main headings. **Assert:** `await expect(element).toBeVisible()`. Read both the computed `color` and `backgroundColor`. Implement or inject a real relative luminance calculation function to compute the contrast ratio of these elements and assert `expect(ratio).toBeGreaterThanOrEqual(4.5)`. **No hardcoded `return true`**.

### Feature 2: Scrollytelling Animations
**Goal:** Verify edge conditions for scroll-triggered Framer-motion elements.

*   **Test 2.1: Rapid scrolling recovery**
    *   *Logic:* Locate animated elements near the footer. **Assert:** `await expect(footerElement).toBeAttached()`. Simulate an immediate rapid scroll to the bottom of the page. Wait for a fixed transition duration, then assert `await expect(footerElement).toBeVisible()` and check that its opacity is `1`.
*   **Test 2.2: Reverse scrolling visibility persistence**
    *   *Logic:* Scroll down to an animated element. **Assert:** `await expect(animatedElement).toBeVisible()` after scroll. Scroll back up to the top, then scroll down again. Assert the element remains visible or correctly re-triggers its animation, verifying it does not permanently disappear.
*   **Test 2.3: Reduced motion accessibility preference**
    *   *Logic:* Emulate `{ colorScheme: 'light', reducedMotion: 'reduce' }`. Locate a normally animated element. **Assert:** `await expect(animatedElement).toBeAttached()`. Assert that the element is immediately visible without scrolling, or verify its computed `transition-duration` is `0s` or `none`.
*   **Test 2.4: Animation bounding box on mobile viewports**
    *   *Logic:* Set viewport to mobile (375x812). Scroll to an animated element. **Assert:** `await expect(animatedElement).toBeAttached()`. Verify that the element triggers and becomes visible based on mobile scroll offset thresholds, asserting `await expect(animatedElement).toBeVisible()` within the mobile viewport.
*   **Test 2.5: Resize interruption during animation**
    *   *Logic:* Start scrolling to trigger an animation. Mid-scroll, resize the viewport from Desktop to Tablet dimensions. **Assert:** `await expect(animatedElement).toBeVisible()` eventually, ensuring resize events do not leave the layout in an intermediate transparent or broken state.

### Feature 3: Media Display & Typography
**Goal:** Verify fallback mechanisms, boundary text lengths, and media load failures.

*   **Test 3.1: Typography fallback enforcement**
    *   *Logic:* Locate a primary `h1` element. **Assert:** `await expect(heading).toBeVisible()`. Evaluate its computed `font-family` and assert it contains standard serif fallbacks (e.g., `'Times New Roman', Times, serif`), preventing layout breakage if the custom font fails to load.
*   **Test 3.2: Extremely long text handling without overflow**
    *   *Logic:* Locate a specific text container. **Assert:** `await expect(container).toBeVisible()`. Use `page.evaluate` to artificially inject a 5000-character unbroken string into the container. Assert that the container's width does not exceed the viewport width, verifying that `overflow-wrap: break-word` or similar rules apply.
*   **Test 3.3: Missing image source graceful fallback**
    *   *Logic:* Intercept network requests and abort requests for images (`**/*.{png,jpg,jpeg,webp}`). Reload the page. Locate an image element. **Assert:** `expect(await image.count()).toBeGreaterThan(0)`. Assert the layout does not collapse and the image's `alt` attribute is present and correctly populated.
*   **Test 3.4: Video load failure boundary**
    *   *Logic:* Intercept and block video requests (`**/*.{mp4,webm}`). Locate the video player element. **Assert:** `await expect(videoElement).toBeAttached()`. Verify that a poster image is configured (`await expect(videoElement).toHaveAttribute('poster')`) or a fallback container is displayed.
*   **Test 3.5: Responsive media sizing constraint**
    *   *Logic:* Set viewport to 400px width. Locate hero media (image/video). **Assert:** `await expect(mediaContainer).toBeVisible()`. Evaluate its width and assert it is strictly less than or equal to 400px, ensuring media elements do not break the mobile layout boundaries.

### Feature 4: Lead Generation & CTA
**Goal:** Verify form validation boundaries, rate limits, and malicious inputs.

*   **Test 4.1: Empty form submission rejection**
    *   *Logic:* Locate the submit button. **Assert:** `await expect(submitButton).toBeVisible()`. Click submit without filling any fields. Assert that form submission does not proceed and HTML5/custom validation messages are displayed on required fields (`await expect(emailInput).toHaveAttribute('aria-invalid', 'true')` or equivalent).
*   **Test 4.2: Invalid email format boundary**
    *   *Logic:* Locate the email input field. **Assert:** `await expect(emailInput).toBeVisible()`. Fill with "invalid@email@domain.com". Click submit. Assert that an error state is triggered and the form is not sent.
*   **Test 4.3: XSS payload input handling**
    *   *Logic:* Locate a text field (e.g., Name or Message). **Assert:** `await expect(textField).toBeVisible()`. Input `<script>alert("hack")</script>`. Verify that the UI properly encodes this input without execution, and that the value remains exactly as typed in the input's `value` attribute.
*   **Test 4.4: Rapid double-submit prevention**
    *   *Logic:* Fill out the form with valid data. Locate the submit button. **Assert:** `await expect(submitButton).toBeVisible()`. Click the submit button 5 times rapidly. Assert that the button state changes to 'disabled' or 'loading' after the first click (`await expect(submitButton).toBeDisabled()`), preventing multiple submissions.
*   **Test 4.5: Calendly CTA visibility on boundary viewports**
    *   *Logic:* Set viewport to ultra-small mobile (320x480). Locate the Calendly CTA. **Assert:** `await expect(calendlyButton).toBeVisible()`. Verify its bounding box is fully within the viewport. Set viewport to ultra-wide (3840x2160) and assert it is still visible and clickable.
