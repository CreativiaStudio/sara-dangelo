# Handoff Report: tier1.spec.ts Fix Strategy

## Observation
1. The test suite at `tests/e2e/tier1.spec.ts` relies heavily on conditional logic to bypass tests when UI components are missing. Specifically, lines 43, 61, 79, 87, 97, 102, 112, 124, 142, 152, 160, 192, 201, 206, 213, 220, 228, 234, 242, and 250 use the pattern `if (await locator.count() > 0)` or similar.
2. For multiple tests (e.g., Test 6 "Hero Fade-In", Test 13 "Hero Video Constraints"), the core assertions are completely enclosed within these `if` blocks. If the elements do not exist, the tests skip the assertions and pass silently.
3. Test 10 includes an `else` branch that substitutes the assertion for a basic scroll check if the parallax background is missing.

## Logic Chain
1. **Goal**: Ensure the E2E tests strictly validate the existence, styling, and behavior of the landing page as required, instead of treating them as optional.
2. **Playwright Mechanics**: Playwright locators are lazy and `expect` assertions (e.g., `toBeVisible`, `toBeAttached`) have auto-retrying behavior. Wrapping assertions in an immediate `count()` check defeats this built-in waiting mechanism.
3. **Removal**: By removing the conditional `if` wrappers, the execution will fall directly onto the Playwright assertions.
4. **Outcome**: The assertions will now automatically wait for the specified elements to appear. If the elements are missing, the assertions will time out and the test will fail, exactly as an E2E integrity check should.
5. **Handling Collections**: For tests asserting over a collection of elements (e.g., iterating over headings in Test 11 or gallery items in Test 8), the tests must first unconditionally assert that the collection is not empty (e.g., `await expect(locator.first()).toBeAttached()`) to avoid passing a `0` count loop.

## Caveats
- No code has been implemented per constraints. This is solely the fix strategy.
- Removing these bypasses will likely cause the entire test suite to fail until the actual application UI is implemented to satisfy the design constraints.

## Conclusion
The fix strategy involves the following specific actions for `tests/e2e/tier1.spec.ts`:
1. **Strip Conditional Checks**: Remove all `if (await locator.count() > 0)` and `if (count > 0)` statements across the entire test suite.
2. **Apply Unconditional Assertions**: Rely on direct, unconditional Playwright assertions like `await expect(locator).toBeVisible()` or `await expect(locator).toBeAttached()`.
3. **Validate Collections**: Before running a `for` loop over elements, explicitly ensure the list is populated by asserting the presence of the first item (`await expect(locator.first()).toBeAttached()`).
4. **Remove Fallbacks**: Remove the `else` block in Test 10 and unconditionally mandate the existence of the parallax background.
5. **Enforce Interaction Outcomes**: In tests 17 and 18, unconditionally wait for and assert the visibility of the expected `errorMsg` or `successMessage` respectively.

## Verification Method
1. Inspect the source code of `tests/e2e/tier1.spec.ts` to ensure no `if (await locator.count() > 0)` statements exist.
2. Run `npx playwright test tests/e2e/tier1.spec.ts`.
3. The tests should consistently fail on missing features instead of silently passing.
