# Handoff Report: Tier 4 Scenarios Strategy

## Observation
1. `TEST_INFRA.md` defines 5 specific scenarios for Tier 4:
   - S1: Visitor explores full page (triggering animations) and submits lead form successfully (F1, F2, F3, F4)
   - S2: Mobile visitor navigates layout, reads typography, and attempts to submit invalid email (F1, F3, F4)
   - S3: Visitor quickly scrolls through the page, validating performance of media and animations (F2, F3)
   - S4: Visitor clicks Calendly CTA redirect, bypassing the lead generation form (F1, F4)
   - S5: Network delay simulation during form submission on high-fashion responsive layout (F1, F4)
2. `tests/e2e/tier4.spec.ts` currently implements 5 scenarios, but they diverge from the requirements:
   - Scenario 1 tests basic scrolling and form submission, but does not explicitly validate F1 (palette) or F3 (typography).
   - Scenario 2 claims to test (F1, F2, F3) instead of (F1, F3, F4) and doesn't explicitly validate typography readability.
   - Scenario 3 claims to test (F2, F3, F4) instead of (F2, F3) and only does a basic check for elements at the bottom.
   - Scenario 4 implements a "Double Submission Journey" instead of the required "Calendly CTA redirect".
   - Scenario 5 implements network delay but does not explicitly enforce a "responsive layout" (e.g. mobile emulation) as specified in the scenario title, and lists only F1.

## Logic Chain
- To *perfectly* implement the scenarios defined in `TEST_INFRA.md`, `tier4.spec.ts` must be rewritten to strictly follow the scenario descriptions and the features (F1-F4) required for each.
- **Scenario 1** needs explicit UI checks for the High Fashion Layout (F1) and Typography (F3), rather than just scrolling down.
- **Scenario 2** needs its title corrected to (F1, F3, F4). It should explicitly check the mobile layout and typography before attempting the invalid form submission.
- **Scenario 3** needs its title corrected to (F2, F3). It should ensure that fast scrolling still correctly triggers the scrollytelling animations (F2) and properly loads media (F3) without skipping states.
- **Scenario 4** is completely incorrect. It must be entirely rewritten to test clicking the Calendly CTA and verifying the redirect/popup, explicitly bypassing the normal lead generation form.
- **Scenario 5** must incorporate a responsive viewport (e.g., tablet or mobile size) to fulfill the "responsive layout" requirement, alongside testing the network delay and form submission (F4).

## Caveats
- I did not run the application to verify the exact CSS classes or HTML structure. The implementer will need to inspect the DOM to write accurate selectors for F1/F3 checks (e.g., verifying `font-family` for serif/sans-serif, checking background colors to ensure no pure `#000000` is used).
- For Scenario 4, the implementer needs to ensure the application actually has a Calendly CTA redirect implemented; if not, the test will fail until the app is updated.

## Conclusion
The `tests/e2e/tier4.spec.ts` file must be rewritten to align perfectly with `TEST_INFRA.md`.
**Recommended Strategy:**
1. **S1**: Keep desktop emulation. Add assertions for palette (no pure black), typography (serif/sans-serif), and verify animation states before submitting the form.
2. **S2**: Update features to F1, F3, F4. Keep mobile emulation. Add assertions for typography on mobile, then test the invalid email submission.
3. **S3**: Update features to F2, F3. Keep fast scroll. Add assertions to verify that framer-motion elements become visible and media (WebP/Video) resolves properly.
4. **S4**: Completely rewrite. Find the Calendly CTA link/button, click it, and assert the navigation or popup bypasses the standard form.
5. **S5**: Update features to F1, F4. Add mobile/tablet viewport emulation. Keep the network interception delay, but add assertions to check that the layout doesn't break while the button is in the loading state.

## Verification Method
1. Read the newly updated `tests/e2e/tier4.spec.ts` to ensure it implements the exact 5 scenarios and targets the correct features.
2. Run `npx playwright test tests/e2e/tier4.spec.ts` to verify the tests run and pass.
