# Handoff Report: Tier 3 & 4 E2E Test Strategy

## 1. Observation
- Read `TEST_INFRA.md` which defines 4 core features: (F1) Lead Generation Form, (F2) Media Optimization, (F3) Responsive Layout, (F4) Scroll Animations.
- `TEST_INFRA.md` specifies Tier 3 as pairwise coverage of major feature interactions, and Tier 4 as 5 specific real-world application scenarios.
- Read `SCOPE.md` which lists Tier 3 & 4 tests as IN_PROGRESS.
- Examined `tests/e2e/tier1.spec.ts` and `tests/e2e/tier2.spec.ts` and verified that basic isolated feature functionality and negative/boundary cases (like XSS, network failures, empty form submission, and responsive boundaries) are already covered.

## 2. Logic Chain
- Because Tier 1 and Tier 2 adequately cover isolated positive and negative cases, Tier 3 should focus exclusively on cross-feature conflicts. Using the pairwise method for 4 features yields 6 distinct interaction pairs:
  - F1 x F2 (Form + Media)
  - F1 x F3 (Form + Responsive)
  - F1 x F4 (Form + Animations)
  - F2 x F3 (Media + Responsive)
  - F2 x F4 (Media + Animations)
  - F3 x F4 (Responsive + Animations)
- For Tier 4, `TEST_INFRA.md` explicitly lists 5 scenarios. We need to translate these into Playwright-actionable step-by-step test cases involving network interception, viewport adjustments, and simulated user inputs to mimic realistic user journeys.

## 3. Caveats
- Per instructions, I have only outlined the strategy and test cases, without implementing the Playwright `.spec.ts` files.
- The test outlines rely on Playwright's `page.route` (for network simulation) and `page.setViewportSize` (for device simulation), which have been proven to work based on `tier2.spec.ts`.

## 4. Conclusion
I recommend the following test case outlines to be implemented in `tier3.spec.ts` and `tier4.spec.ts`:

### Tier 3: Pairwise Cross-Feature Tests (`tier3.spec.ts`)
1. **F1 x F2 (Form + Media):** Submit the form while the hero video is actively playing in the background. Verify that the form submission works and video playback isn't interrupted by the form state change.
2. **F1 x F3 (Form + Responsive):** Load the page on a mobile viewport (e.g., 375x667), tap into the email input to trigger focus, and verify that the validation error messages remain fully visible without causing horizontal scroll or layout breaks.
3. **F1 x F4 (Form + Animations):** Scroll down to the form section. Assert that the form input is properly revealed by the scroll animation and becomes interactive, then verify the form can be submitted successfully.
4. **F2 x F3 (Media + Responsive):** Resize the viewport from desktop to mobile and verify that media containers resize proportionally (e.g., checking `object-fit` and bounding box of the hero video or portfolio images).
5. **F2 x F4 (Media + Animations):** Scroll quickly to a lazy-loaded image section. Verify that the reveal animation handles the image gracefully, even if the image is still in a "skeleton" loading state.
6. **F3 x F4 (Responsive + Animations):** Load the page on a mobile device and trigger scroll animations. Verify no layout shifts (`scrollWidth > innerWidth`) occur during the animation transitions.

### Tier 4: Real-World Scenarios (`tier4.spec.ts`)
1. **Scenario 1 (Happy Path - F1, F2, F3, F4):** Emulate a desktop user. Page loads -> Wait for hero video -> Scroll smoothly down the page (triggering animations and lazy-loading media) -> Reach the Funnel section -> Fill out the form -> Submit -> Assert success message.
2. **Scenario 2 (Mobile Error Recovery - F1, F2, F3):** Emulate a mobile device. Open the hamburger menu -> Navigate to Portfolio -> Close menu -> Scroll to form -> Enter invalid email -> Submit -> See error -> Correct the email -> Submit -> Assert success.
3. **Scenario 3 (Fast Scroller - F2, F3, F4):** Emulate a tablet device. Execute a rapid `scrollTo(bottom)`. Verify that multiple animations fire sequentially or simultaneously without throwing errors, and that media elements at the bottom eventually render successfully.
4. **Scenario 4 (Double Submission Journey - F1, F3):** User submits the form successfully -> Receives success message -> User reloads the page -> Resubmits the same form -> Verify the system correctly handles the duplicate submission (e.g., shows success again or warns if backend prevents it) without UI crash.
5. **Scenario 5 (Flaky Network - F1):** Intercept network requests to add a 3-second delay. User scrolls to form -> Submits valid data -> Assert a loading state/spinner is visible -> Wait for response -> Assert success message appears.

## 5. Verification Method
- **Action:** A subsequent agent should create `tests/e2e/tier3.spec.ts` and `tests/e2e/tier4.spec.ts` and implement the outlined test cases.
- **Validation:** Run `npx playwright test tests/e2e/tier3.spec.ts tests/e2e/tier4.spec.ts`.
- **Success Criteria:** All tests must pass (exit code 0), verifying the logic described in the scenarios.
