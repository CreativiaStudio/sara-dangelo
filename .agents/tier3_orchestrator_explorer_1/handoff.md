# Tier 3 E2E Test Cases Handoff

## Observation
- `SCOPE.md` directs the creation of Playwright E2E tests for Cross-Feature Combinations (Tier 3) in `tests/e2e/tier3.spec.ts`.
- `TEST_INFRA.md` defines 4 features:
  - F1: High Fashion Layout & Palette (White/cream/beige/gold/brown, NO BLACK)
  - F2: Scrollytelling Animations (Framer-motion scroll reveals, transitions)
  - F3: Media Display & Typography (Serif titles, sans-serif details, WebP/Video)
  - F4: Lead Generation & CTA (Supabase integration, Form submission, Calendly redirect)
- Tier 3 requires pairwise coverage of major feature interactions.

## Logic Chain
With 4 features, generating all pairwise combinations yields 6 distinct interaction pairs. To satisfy Tier 3 coverage requirements, we must design one test case per pair that explicitly exercises the intersection of those two features:

1. **F1 & F2 (Layout + Animations)**
   *Rationale*: Animations must trigger correctly across different viewports without causing horizontal scrolling or layout breaks.
   *Test Case*: Verify scrollytelling animations trigger cleanly on both desktop and mobile viewports without layout shifts.

2. **F1 & F3 (Layout + Media & Typography)**
   *Rationale*: Typography and media must strictly adhere to the high-fashion palette (no pure black) and adapt responsively.
   *Test Case*: Verify media scales responsively and typography colors comply with the high-fashion palette (no `#000` or `#000000`).

3. **F1 & F4 (Layout + Lead Gen)**
   *Rationale*: The form UI must fit seamlessly within the high-fashion aesthetic and be usable on all screen sizes.
   *Test Case*: Verify the lead generation form and CTA adhere to the color palette (e.g., gold/brown buttons) and display correctly on mobile viewports.

4. **F2 & F3 (Animations + Media & Typography)**
   *Rationale*: Large media assets and prominent typography must animate gracefully when scrolled into view.
   *Test Case*: Verify that serif titles and WebP/Video elements transition from hidden/transparent to visible precisely when scrolled into the viewport.

5. **F2 & F4 (Animations + Lead Gen)**
   *Rationale*: The form must animate into view and become fully interactive (not blocked by animation overlays).
   *Test Case*: Verify the lead generation section animates into view on scroll and its form fields/buttons immediately become interactive.

6. **F3 & F4 (Media & Typography + Lead Gen)**
   *Rationale*: Form text and adjacent context media must follow the typography rules.
   *Test Case*: Verify the lead generation form uses correct sans-serif fonts for inputs and serif fonts for its section title, alongside correct rendering of any adjacent media.

## Caveats
- Since the tests are opaque-box and the actual DOM structure is not yet implemented, the test cases describe expected behaviors rather than specific CSS selectors or data-testids. The implementer will need to assign appropriate locators.
- "No pure black" checks might require evaluating computed styles for RGB values `rgb(0, 0, 0)` rather than just hex codes.

## Conclusion
Implement the 6 defined pairwise test cases in `tests/e2e/tier3.spec.ts`. Each test should simulate user interactions (like scrolling or resizing) and assert that the intersecting features behave correctly together.

## Verification Method
1. Create and implement `tests/e2e/tier3.spec.ts` with the 6 proposed test cases.
2. Run the tests via the Playwright CLI: `npx playwright test tests/e2e/tier3.spec.ts`.
3. The validation is successful if the command exits with code 0.
