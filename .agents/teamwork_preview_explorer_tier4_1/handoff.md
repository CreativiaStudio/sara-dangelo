# Handoff Report: Rewrite Strategy for tier4.spec.ts

## 1. Observation
- `TEST_INFRA.md` requires 5 specific Real-World Scenarios for Tier 4.
- `tier4.spec.ts` currently has tests that partially implement these scenarios but use incorrect locators and feature tags.
- In `components/DoubleFunnelSection.tsx`:
  - The lead generation section has `id="funnel"`, not `id="contact"`.
  - The form requires both `name` (placeholder `"Il tuo nome"`) and `email` (placeholder `"La tua migliore email"`).
  - The submit button has the text `"Scarica il Lookbook"`, not `"Scarica ora"`.
  - The success message includes the text `"Grazie"`.
  - The Calendly CTA is an `<a>` tag with `href="https://calendly.com/sara-dangelo"`, `target="_blank"`, and text `"Scegli la Data su Calendly"`.
- In `components/ReviewsSection.tsx`, the ID is `id="social-proof"`, not `id="reviews"`.
- Scenario 4 in `tier4.spec.ts` currently tests a "Double Submission Journey", which contradicts `TEST_INFRA.md`'s requirement to test the "Calendly CTA redirect, bypassing the lead generation form".
- Scenario 5 in `tier4.spec.ts` ("Flaky Network") does not explicitly test a "responsive layout" as required by `TEST_INFRA.md`, relying instead on the default desktop viewport.

## 2. Logic Chain
- **Scenario 1 (Full page explore & submit):** Must be updated to target `section#funnel`, fill both the `nome` and `email` inputs, and click the `"Scarica il Lookbook"` button.
- **Scenario 2 (Mobile Error Recovery):** Title features should be updated to `(F1, F3, F4)`. Form submission must be updated exactly as in Scenario 1. To verify the visitor "reads typography", an assertion should check the visibility of a typography element (e.g., `section#portfolio h2`) before submitting.
- **Scenario 3 (Fast Scroller):** Title features should be updated to `(F2, F3)`. The assertion for the reviews section must look for `section#social-proof` instead of `section#reviews`.
- **Scenario 4 (Calendly Redirect):** The existing test must be completely replaced. The new test should navigate to the page, scroll to `#funnel`, and click the Calendly link (`page.locator('a[href*="calendly.com"]')`). Since it opens in a new tab (`target="_blank"`), the test must use `context.waitForEvent('page')` and verify the new page URL contains `"calendly.com"`.
- **Scenario 5 (Flaky Network):** Title should be `Scenario 5: Flaky Network on Responsive Layout (F1, F4)`. The test must explicitly set a mobile viewport (e.g., `width: 390, height: 844`) to fulfill the "responsive layout" requirement. The route interception should be narrowed to `**/api/supabase`. The form submission code must be updated with the correct locators.

## 3. Caveats
- Playwright's native HTML validation check in Scenario 2 relies on the `required` attribute. Since `DoubleFunnelSection.tsx` uses the `required` attribute on both inputs, `evaluate((el: HTMLInputElement) => !el.validity.valid)` will continue to work perfectly.
- In Scenario 4, Playwright must wait for the new page event because the Calendly link uses `target="_blank"`. If the link is changed to open in the same tab, the test will need to be adjusted.

## 4. Conclusion
The file `tests/e2e/tier4.spec.ts` requires a comprehensive rewrite to align with the application's actual DOM structure (`#funnel`, `#social-proof`, correct form fields) and to perfectly implement the scenarios strictly as defined in `TEST_INFRA.md` (especially rewriting Scenario 4 and adding responsive viewports to Scenario 5).

## 5. Verification Method
- Overwrite `tests/e2e/tier4.spec.ts` with the changes described above.
- Run `npx playwright test tests/e2e/tier4.spec.ts`.
- All 5 tests must pass successfully, and Playwright should exit with code 0.
