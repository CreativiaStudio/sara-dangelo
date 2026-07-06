# Handoff Report: Tier 4 Test Rewrite Strategy

## Observation
I reviewed `TEST_INFRA.md` which specifies 5 Real-World Application Scenarios for Tier 4:
1. Visitor explores full page (triggering animations) and submits lead form successfully. (F1, F2, F3, F4) [High]
2. Mobile visitor navigates layout, reads typography, and attempts to submit invalid email. (F1, F3, F4) [Medium]
3. Visitor quickly scrolls through the page, validating performance of media and animations. (F2, F3) [Medium]
4. Visitor clicks Calendly CTA redirect, bypassing the lead generation form. (F1, F4) [Medium]
5. Network delay simulation during form submission on high-fashion responsive layout. (F1, F4) [High]

I then examined the existing `tests/e2e/tier4.spec.ts` (lines 1-170) and observed several discrepancies:
- **Test 1** is functionally close but lacks assertions for the required features (F1 layout/colors, F3 typography).
- **Test 2** has incorrect feature tags in the title (claims F1, F2, F3; should be F1, F3, F4). It misses the "reads typography" requirement (no typography assertions).
- **Test 3** has incorrect feature tags (claims F2, F3, F4; should be F2, F3). It scrolls to the bottom instantly using `window.scrollTo(0, document.body.scrollHeight)`, which may bypass intersection observers and framer-motion animations rather than rapidly triggering them.
- **Test 4** completely implements the wrong scenario. It tests "Double Submission Journey", whereas `TEST_INFRA.md` requires "Visitor clicks Calendly CTA redirect".
- **Test 5** has incorrect feature tags (claims F1; should be F1, F4). It doesn't configure a responsive layout as specified in the scenario name. Additionally, it intercepts all POST requests generically rather than specifically targeting the form submission.

## Logic Chain
To perfectly align the tests with `TEST_INFRA.md`, the file `tests/e2e/tier4.spec.ts` needs the following structural rewrite:

1. **Scenario 1 (F1, F2, F3, F4)**: 
   - Add explicit checks for "High Fashion Layout" (F1) by validating background colors (e.g., ensuring no pure black `#000000` or `rgb(0, 0, 0)` is used).
   - Validate typography (F3) by checking that titles use serif fonts and body text uses sans-serif.
   - Maintain the smooth scrolling to validate "triggering animations" (F2).
   
2. **Scenario 2 (F1, F3, F4)**:
   - Update test title to match feature tags.
   - Set a mobile viewport.
   - Add explicit assertions to "read typography" (verify `font-family` on key elements).
   - Keep the invalid email submission and native HTML validation check.

3. **Scenario 3 (F2, F3)**:
   - Update test title to match feature tags.
   - Replace the single instant scroll with a fast programmatic loop or `mouse.wheel` to rapidly scroll through the page, effectively firing scroll events and triggering animations sequentially.
   - Add assertions that media (images/videos) and framer-motion elements are visible and haven't broken the layout.

4. **Scenario 4 (F1, F4)**:
   - **Complete rewrite needed.** Delete the double submission logic.
   - Implement a test that locates the Calendly CTA (button or link), clicks it, and verifies either the URL change (if it redirects) or the appearance of the Calendly popup iframe.

5. **Scenario 5 (F1, F4)**:
   - Update test title to match feature tags.
   - Emulate a mobile/tablet viewport to satisfy "responsive layout".
   - Target the exact form submission API endpoint in `page.route` rather than using `**/*` with method `POST`.
   - Verify the loading state (e.g., disabled button or spinner) during the 3-second delay, followed by the success state.

## Caveats
- As an explorer agent, I did not modify `tier4.spec.ts`.
- The exact CSS classes, font families, and Calendly URLs/attributes are not hardcoded in the test infrastructure, so the implementer will need to look at the DOM or application code to write the precise Playwright locators and assertions (e.g., `toHaveCSS('font-family', /serif/)`).

## Conclusion
The `tests/e2e/tier4.spec.ts` file needs to be rewritten. Test 4 must be completely replaced to test the Calendly redirect. Tests 1, 2, 3, and 5 need their feature tags updated in the descriptions and require targeted assertions (e.g., `expect(locator).toHaveCSS()`) to truly validate the specific features (F1, F2, F3, F4) mandated by `TEST_INFRA.md`.

## Verification Method
1. Read the newly implemented `tests/e2e/tier4.spec.ts` to confirm the 5 test titles and logic match the scenarios in `TEST_INFRA.md`.
2. Run `npx playwright test tests/e2e/tier4.spec.ts`.
3. Verify the exit code is `0` and all tests pass without skipping.
