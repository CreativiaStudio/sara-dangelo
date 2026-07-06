# Tier 3 E2E Test Design Handoff

## 1. Observation
- `SCOPE.md` (lines 8-11) requires: "Tier 3 Tests: Implement pairwise coverage of major feature interactions (e.g. form + mobile layout, scroll + media)".
- `TEST_INFRA.md` (lines 7-13) defines 4 features:
  - **F1**: High Fashion Layout & Palette (White/cream/beige/gold/brown, NO BLACK)
  - **F2**: Scrollytelling Animations (Framer-motion scroll reveals, transitions)
  - **F3**: Media Display & Typography (Serif titles, sans-serif details, WebP/Video)
  - **F4**: Lead Generation & CTA (Supabase integration, Form submission, Calendly redirect)
- The target file for implementation is `tests/e2e/tier3.spec.ts`.

## 2. Logic Chain
- A full pairwise combination of 4 features yields exactly 6 unique pairs: (F1,F2), (F1,F3), (F1,F4), (F2,F3), (F2,F4), (F3,F4).
- Designing one dedicated Playwright test case per pair ensures 100% pairwise coverage of cross-feature interactions, isolating interaction defects.
- Each test is designed to target specific overlapping concerns between the two features (e.g., F1+F4 tests the strict "NO BLACK" rule on form input focus states, F2+F4 tests form interactability after scroll animations).

## 3. Caveats
- No code was written per the read-only constraint.
- The tests rely on DOM elements being correctly structured and ideally having `data-testid` attributes. The implementing agent will need to adapt selectors based on the actual component tree.

## 4. Conclusion
We recommend implementing the following 6 test cases in `tests/e2e/tier3.spec.ts`:

1. **F1 + F2 (Layout + Animations)**
   - *Scenario*: Scroll through the page and verify layout constraints and palette colors remain stable during animation states (e.g., no layout shift or color flash).
2. **F1 + F3 (Layout + Media/Typography)**
   - *Scenario*: Verify that media elements (images, videos) scale correctly across responsive breakpoints and typography strictly respects the high-fashion color palette (no pure black).
3. **F1 + F4 (Layout + Lead Gen)**
   - *Scenario*: Verify the lead gen form and CTA are responsive and their styling (borders, placeholder text, focus rings) strictly avoids pure black (`rgb(0, 0, 0)`).
4. **F2 + F3 (Animations + Media)**
   - *Scenario*: Scroll to media sections to verify that images or videos successfully trigger and complete their Framer-motion entrance animations (e.g., fade-in, parallax).
5. **F2 + F4 (Animations + Lead Gen)**
   - *Scenario*: Scroll to the lead gen section, wait for its reveal animation to complete, and verify the form elements are fully functional, interactable, and not obscured by animation layers.
6. **F3 + F4 (Media/Typography + Lead Gen)**
   - *Scenario*: Verify the typography hierarchy (sans-serif for inputs/details, serif for CTA/headers) is correctly applied within the form and its adjacent media sections.

## 5. Verification Method
- The implementing agent should convert the 6 scenarios above into Playwright tests in `tests/e2e/tier3.spec.ts`.
- Run the command `npx playwright test tests/e2e/tier3.spec.ts` to ensure all cross-feature combinations pass with an exit code of 0.
