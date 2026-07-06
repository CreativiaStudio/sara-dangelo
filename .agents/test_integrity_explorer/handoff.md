## Handoff Report: Test Integrity Fix Strategy

1. **Observation** 
The file `tests/e2e/tier1.spec.ts` contains 17 instances where test logic and assertions are wrapped in a conditional check for element existence, using patterns like `if (await element.count() > 0)` or `if (count > 0)`. Examples include:
- Test 3 (Generous Whitespace): `if (count > 0)`
- Test 4 (Desktop Layout Integrity): `if (await section.count() > 0)`
- Test 6 (Hero Fade-In): `if (await hero.count() > 0)`
- Test 13 (Hero Video Constraints): `if (await heroVideo.count() > 0)`
- Test 16 (CTA Visibility & Styling): `if (await emailForm.count() > 0)`
The complete list of tests employing this anti-pattern encompasses tests 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, and 20. As noted in the forensic audit report (`.agents/forensic_auditor/handoff.md`), if elements are missing, the checks are entirely skipped and the tests incorrectly pass.

2. **Logic Chain**
- The forensic audit flagged these conditionals as "facade tests" because they allow the suite to pass even if the UI is completely unrendered or missing.
- Playwright tests are intended to assert that specific functionalities and layouts *exist* and meet requirements, not merely that they match a requirement *if* they happen to exist.
- To restore the integrity of the test suite, we must replace the conditional `count() > 0` checks with unconditional Playwright assertions that enforce the presence and correct state of the elements.
- When Playwright encounters `await expect(locator).toBeVisible()` or `await expect(locator).toHaveAttribute(...)`, it automatically waits for the element to appear within the timeout, thus correctly failing if the implementation is missing.

3. **Caveats**
- Test 10 ("Parallax / Depth Indicators") uses an `else` branch that scrolls the page as a fallback. This fallback must be removed; the test should strictly expect the parallax background to exist and animate.
- I have not investigated whether the current actual UI implementation has these elements. Making these tests unconditional will likely cause them to fail until the implementer builds the required UI for the Sara D'Angelo landing page.
- Test 15 ("Performance Loading") dynamically checks for lazy images. If the design does not require lazy images beneath the fold, the test assertion might need to be refined, but it currently checks `if (count > 0)`. The strategy assumes these elements are strictly required.

4. **Conclusion**
The conditional bypasses must be removed. The fix strategy for `tests/e2e/tier1.spec.ts` is:
1. Identify all `if (await locator.count() > 0)` or `if (count > 0)` statements.
2. Remove the `if` wrapper blocks.
3. For locators where visibility is expected, ensure the test explicitly asserts existence using `await expect(locator).toBeVisible()` or `await expect(locator).toBeAttached()`.
4. Ensure subsequent assertions (like checking styles, attributes, or text) run unconditionally after the visibility check.
5. In Test 10, remove the `else` block and unconditionally test the parallax behavior.
6. In tests with loops over counts (like Test 8, Test 11), replace manual looping logic that relies on `count > 0` with assertions that expect a specific minimum number of elements, e.g., `expect(await locator.count()).toBeGreaterThan(0)`, and then iterate, or use Playwright's built-in list assertions.

5. **Verification Method**
- Use `grep_search` for `count() > 0` in `tests/e2e/tier1.spec.ts`. The command should return zero matches related to conditional test bypasses.
- Run `npx playwright test tests/e2e/tier1.spec.ts`. If the corresponding features are not implemented, the tests should unconditionally fail properly instead of passing.
