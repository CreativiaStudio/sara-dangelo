# Handoff: Tier 1 E2E Test Strategy & Scenarios

## 1. Observation
- `TEST_INFRA.md` requires >= 5 Tier 1 tests for 4 features: Lead Generation Form, Media Optimization, Responsive Layout, Scroll Animations.
- `ORIGINAL_REQUEST.md` mandates specific elements:
  - **Lead Gen**: Email capture form (Lookbook) and Calendly CTA.
  - **Media**: Hero video (autoplay, loop, muted) and optimized portfolio images (WebP, lazy loaded).
  - **Responsive Layout**: 5 specific sections (Hero, Il Metodo, Portfolio, Social Proof, Double Funnel) styled as a fashion magazine.
  - **Animations**: `framer-motion` used for scroll reveals, transitions, and hover states.

## 2. Logic Chain
- As an opaque-box test suite, we must test externally observable behaviors without depending on component internals.
- **Lead Generation**: We will test basic form structure, positive submission flow (expecting a success UI state since DB is opaque), required field validation, email format validation, and the secondary CTA button.
- **Media Optimization**: We will test for presence of correct HTML attributes (`autoplay`, `muted`, `loop` on video; `loading="lazy"` on images) and use network interception to verify images are loaded in modern formats (WebP/AVIF).
- **Responsive Layout**: We will configure tests to run in Desktop (1920x1080) and Mobile (375x667) viewports, verifying all 5 sections exist, are visible, and that the viewport does not overflow horizontally.
- **Scroll Animations**: Playwright will simulate scrolling and verify that CSS properties like `opacity` and `transform` change from initial states to visible states, confirming `framer-motion` triggers. We will also test hover interactions.

## 3. Caveats
- Since exact `data-testid` attributes or class names are not yet defined, the scenarios describe semantic targets (e.g., "The email input field", "The primary CTA"). The implementer of the tests will need to map these to actual DOM selectors.
- Animation tests are inherently timing-dependent. Assertions should use auto-retrying matchers (e.g., `expect(element).toHaveCSS('opacity', '1')`) rather than hard waits.
- Opaque-box testing of the lead form limits us to verifying the success message; it does not directly verify the Supabase insertion unless an API mock or DB validation step is added.

## 4. Conclusion
The Tier 1 E2E strategy is finalized. The planned test suite will consist of 20 test cases structured into 4 `describe` blocks. These scenarios should be implemented in `tests/e2e/tier1.spec.ts`.

### Planned Test Titles:

**Feature 1: Lead Generation Form**
1. `should display the email capture form and the secondary Calendly CTA`
2. `should show required field validation errors on empty submission`
3. `should show format validation error for an invalid email address`
4. `should display a success message upon valid form submission`
5. `should successfully redirect or open the Calendly modal when clicking the secondary CTA`

**Feature 2: Media Optimization (WebP/Video)**
1. `should render the hero video with autoplay, loop, and muted attributes`
2. `should load the hero video successfully without network errors`
3. `should apply loading="lazy" attribute to portfolio images`
4. `should render portfolio images using Next.js optimized srcset`
5. `should request and serve portfolio images in WebP or AVIF format`

**Feature 3: Responsive Layout & Sections**
1. `desktop: should render all 5 main sections (Hero, Metodo, Portfolio, Social Proof, Funnel)`
2. `mobile: should render all 5 main sections stacked correctly`
3. `mobile: should not have horizontal scrolling overflow (width <= 100vw)`
4. `mobile: should display a mobile-friendly navigation/menu`
5. `mobile: should adjust the portfolio gallery to fit within the mobile viewport width`

**Feature 4: Scroll Animations (Framer Motion)**
1. `should initially hide "Il Metodo" content and reveal it on scroll (opacity transition)`
2. `should reveal portfolio gallery items sequentially when scrolled into view`
3. `should reveal the Social Proof section when scrolling near the bottom of the page`
4. `should trigger a visual transformation (e.g., scale/brightness) when hovering over portfolio images`
5. `should trigger a premium hover state animation on primary CTA buttons`

## 5. Verification Method
1. The implementer writes the code for the tests in `tests/e2e/tier1.spec.ts`.
2. Run `npx playwright test tests/e2e/tier1.spec.ts`.
3. Verify that the command exits with code `0`. If tests fail due to timing on animations or missing elements, the implementation or test selectors need adjustment.
