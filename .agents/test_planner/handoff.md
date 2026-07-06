# Handoff Report: E2E Test Plan for Sara D'Angelo Landing Page

## 1. Observation
- **TEST_INFRA.md**: Identifies a requirement-driven testing approach with 4 core features, explicitly mentioning "High Fashion Layout & Palette (White/cream/beige/gold/brown, NO BLACK)", "Scrollytelling Animations", "Media Display & Typography (Serif titles, sans-serif details)", and "Lead Generation & CTA".
- **tests/e2e/tier1.spec.ts**: Contains an existing test suite structured slightly differently (Lead Gen, Media, Responsive, Scroll) but covering some of the baseline functional aspects.
- The prompt explicitly mandates providing exactly 20 tests, distributed perfectly as 5 tests per the 4 specified features, with strict enforcement of the High Fashion / Vogue aesthetic.

## 2. Logic Chain
To satisfy the requirements without implementing the tests, we outline a precise declarative testing strategy for each specific feature category.
- **Feature 1: High Fashion Layout & Palette**: Requires evaluating the full page to confirm the absence of pure black (`#000000`/`rgb(0,0,0)`) on typography and backgrounds. Tests must also enforce whitespace/padding for the "airy" Vogue feel, check layout presence, and ensure proper high-fashion neutral background tones.
- **Feature 2: Scrollytelling Animations**: Needs assertion of Framer Motion behaviors. Tests will simulate user scroll and observe element transitions (opacity, transform) from hidden to visible.
- **Feature 3: Media Display & Typography**: Playwright can check computed CSS for font families (Serif for headers, Sans-serif for body). Network and DOM tests will verify WebP/AVIF usage and video metadata states.
- **Feature 4: Lead Generation & CTA**: Checks cover presence, inline custom validation, successful simulated submission, Calendly redirect, and premium button hover states. 

## 3. Caveats
- Since this is a test *plan*, no `.spec.ts` code is being modified or generated in this step.
- Some tests (like "no pure black across all elements") might require an aggressive page evaluation script using `window.getComputedStyle`.
- Font checks rely on the computed `font-family` property, which depends on the actual fonts being loaded and correctly applied in the DOM.

## 4. Conclusion
Here is the concrete test strategy consisting of 20 tests mapped to the 4 features:

### 1. High Fashion Layout & Palette (5 Tests)
1. **No Pure Black Test**: Traverse the DOM to assert that no element has a computed `color`, `background-color`, or `border-color` equal to `rgb(0, 0, 0)`.
2. **Palette Compliance**: Verify that the document body and main sections use an approved off-white, cream, or beige background color.
3. **Generous Whitespace**: Check that main content sections (Hero, Metodo, Portfolio, Social Proof, Funnel) possess a minimum padding/margin (e.g., >80px) to guarantee an airy, Vogue-like spatial rhythm.
4. **Desktop Layout Integrity**: Assert that all 5 key sections render sequentially without any horizontal overflow on a 1920px screen.
5. **Mobile Fluidity**: Verify that the layout naturally stacks on a 375px mobile viewport while maintaining the high-fashion design system constraints without breaking.

### 2. Scrollytelling Animations (5 Tests)
6. **Hero Fade-In**: Assert that hero text and media load with an initial opacity of 0 and transition smoothly to opacity 1 upon page mount.
7. **Metodo Scroll Reveal**: Scroll to the "Il Metodo" section and verify that text blocks trigger from a transformed/hidden state to visible as they cross the intersection threshold.
8. **Staggered Gallery Entrance**: Scroll to the Portfolio section and ensure gallery items fade in sequentially (with measured staggered delays).
9. **Premium Hover Transitions**: Hover over portfolio cards and verify that the resulting CSS transform (scale/overlay) occurs with a transition duration, not instantaneously.
10. **Parallax / Depth Indicators**: Simulate a scroll and verify that background elements or floating assets translate vertically at a different rate than the scrollbar (parallax effect).

### 3. Media Display & Typography (5 Tests)
11. **Serif Headings**: Verify that `h1`, `h2`, and `h3` tags have a computed `font-family` that falls back to a Serif typeface (matching the Vogue aesthetic).
12. **Sans-Serif Body**: Assert that `p`, `span`, and input fields default to a clean, readable Sans-Serif typeface.
13. **Hero Video Constraints**: Check that the background video in the Hero section possesses `autoplay`, `loop`, `muted`, and `playsinline` attributes, and achieves a readyState ≥ 1.
14. **Modern Image Formats**: Intercept network requests to confirm that images fetched within `_next/image` are delivered as `image/webp` or `image/avif`.
15. **Performance Loading**: Assert that all images rendered below the fold (e.g., inside the Portfolio and Social Proof sections) contain the `loading="lazy"` attribute.

### 4. Lead Generation & CTA (5 Tests)
16. **CTA Visibility & Styling**: Verify that the main email form and the secondary Calendly CTA are both visible and adhere to the elegant color palette (e.g., gold/brown accents).
17. **High-Fashion Validation**: Submit an empty and invalid form, and verify that the error messages shown are custom-styled elements in the DOM (not generic browser HTML5 tooltips).
18. **Successful Lead Capture**: Fill the form with a valid email and click submit; verify the appearance of a polite, branded success message (verifying the Supabase flow).
19. **Calendly Redirect**: Click the secondary "Book Appointment" CTA and intercept the popup or page navigation to ensure it points to `calendly.com`.
20. **Premium Button Interaction**: Hover over the primary submit button and verify it triggers a smooth color shift or elevation (via `transform` and `box-shadow`) indicative of a premium user experience.

## 5. Verification Method
- **Method**: The plan can be verified by developers to ensure it directly informs the creation or modification of test scripts in `tests/e2e/`.
- **Validation**: When the tests are implemented, running `npx playwright test` should execute exactly these 20 scenarios, and they must all pass with exit code 0 on the completed application.
