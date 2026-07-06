# Tier 1 E2E Test Strategy and Scenarios

## 1. Observation
- `TEST_INFRA.md` dictates Tier 1 tests must cover at least 5 scenarios for each of the 4 core features: Lead Generation Form, Media Optimization, Responsive Layout & Sections, and Scroll Animations.
- The testing methodology is Opaque-box, requirement-driven E2E using Playwright.
- `ORIGINAL_REQUEST.md` details the application UI and functionality:
  - 5 specific sections: Hero (video background), Il Metodo, Portfolio (asymmetrical 10-15 photos), Social Proof, Double Funnel (Lead Magnet for email + CTA for Calendly).
  - WebP conversion, advanced compression, lazy loading for media.
  - Animations via `framer-motion` (scroll reveals, page transitions, hover states).
- Playwright tests are to be placed in `tests/e2e/tier1.spec.ts`.

## 2. Logic Chain
- **Lead Generation Form**: Must verify core positive flow (successful valid submission) and negative flows (empty, invalid format) for the email form, plus verify the secondary Calendly CTA.
- **Media Optimization**: Since the tests are opaque, we can inspect DOM attributes. The background video must have `autoplay`, `loop`, and `muted`. The images must contain `.webp` extensions or `<source type="image/webp">` and have `loading="lazy"`.
- **Responsive Layout & Sections**: We must assert the presence of the 5 key sections on both Desktop and Mobile viewports. A key layout requirement is avoiding horizontal overflow, which breaks mobile experiences.
- **Scroll Animations**: Using Playwright, we can assert that elements below the fold have `opacity: 0` or similar styles initially, and change to `opacity: 1` or `transform` after `page.mouse.wheel()` or `element.scrollIntoViewIfNeeded()`.

## 3. Caveats
- Since the implementation is not yet finalized or known, the exact CSS selectors (e.g., `data-testid` or IDs) are not defined. The scenarios use semantic descriptions (e.g., "Hero section", "Email input"). The developer implementing the tests will need to assign the appropriate locators.
- Confirming "smoothness" of animations via automation is difficult; the test will primarily verify the state change (e.g. opacity shifting from 0 to 1).
- Verifying the Supabase insert opaquely requires either an API mock, checking for a "Success" UI message, or querying the database. We assume a "Success" UI message is sufficient for Tier 1 UI testing.

## 4. Conclusion
The Tier 1 E2E test strategy is ready. Below are the planned test scenarios mapped to the 4 features.

### Planned Test Titles (`tests/e2e/tier1.spec.ts`)

#### Feature 1: Lead Generation Form
1. `F1-T1: Successfully submit valid email for Lead Magnet and view success state`
2. `F1-T2: Prevent form submission when email field is empty`
3. `F1-T3: Prevent form submission when email format is invalid`
4. `F1-T4: Verify the Calendly 'Prenota la tua Call' CTA is present and clickable`
5. `F1-T5: Verify Lead Magnet form elements (input, submit button) are fully rendered`

#### Feature 2: Media Optimization (WebP/Video)
1. `F2-T1: Hero video is present and has autoplay, muted, and loop attributes`
2. `F2-T2: Hero video plays successfully without user interaction`
3. `F2-T3: Portfolio images use lazy loading (loading="lazy" attribute)`
4. `F2-T4: Portfolio images are served in WebP format (via src or picture tag)`
5. `F2-T5: All critical media assets load successfully (Status 200)`

#### Feature 3: Responsive Layout & Sections
1. `F3-T1: All 5 core sections (Hero, Metodo, Portfolio, Reviews, Funnel) are visible on Desktop`
2. `F3-T2: Page has no horizontal overflow on Desktop viewport`
3. `F3-T3: All 5 core sections are properly stacked and visible on Mobile viewport`
4. `F3-T4: Page has no horizontal overflow on Mobile viewport`
5. `F3-T5: Mobile navigation (hamburger menu) opens and functions correctly`

#### Feature 4: Scroll Animations
1. `F4-T1: Hero section elements are visible immediately without scrolling`
2. `F4-T2: 'Il Metodo' elements animate from hidden to visible upon scroll`
3. `F4-T3: Portfolio gallery images reveal sequentially upon scrolling into view`
4. `F4-T4: Social Proof section triggers scroll animations when reached`
5. `F4-T5: Primary CTA buttons possess CSS/motion hover states (scale/color shift)`

## 5. Verification Method
- **To Verify**: The implementer will translate these titles into actual `test('title', async ({ page }) => { ... })` blocks in `tests/e2e/tier1.spec.ts`.
- **Command**: Run `npx playwright test tests/e2e/tier1.spec.ts`. All 20 tests should exist and pass against the development server once implemented.
