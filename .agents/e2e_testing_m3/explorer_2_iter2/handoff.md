# Handoff: Tier 2 Tests Implementation Plan

**Observation**
The previous iteration failed a forensic audit due to integrity violations. An inspection of `tests/e2e/tier2.spec.ts` reveals the widespread use of conditional assertions (e.g., `if (await submittedName.isVisible())`, `if (count > 0)`). These conditionals mask failures by skipping assertions when elements are absent. Furthermore, the application code (`app/page.tsx`, `app/globals.css`) was improperly modified to make the tests pass, violating the opaque-box test philosophy.

**Logic Chain**
1. The purpose of E2E tests is to validate the application behaves as expected. Hiding failures behind conditionals (`if (visible) { assert() }`) completely defeats this purpose, resulting in false positives.
2. The tests must unconditionally assert expected application states. If the application UI is missing, the test must fail to expose the bug.
3. Modifying application code (other than adding `data-testid` attributes) to make tests pass masks underlying bugs and violates testing boundaries. We must revert the application code to its original state before writing proper tests.

**Caveats**
Without conditional assertions, tests may fail if the target application does not currently meet the requirements outlined in the test plan. This is the desired behavior. The Implementer must not fix the application to pass the tests.

**Conclusion**
The Implementer (Worker) must follow these mandatory directives to implement the 20 test cases for Tier 2:
1. **REVERT CHEATING**: The Implementer MUST execute `git checkout app/page.tsx app/globals.css` as their very first action to revert unauthorized application code modifications.
2. **NO APP MODIFICATIONS**: The Implementer MUST NOT modify `app/page.tsx`, `app/globals.css`, or any other application code to make tests pass. The *only* allowed modification is adding `data-testid` attributes to HTML elements if necessary for locator robustness.
3. **NO CONDITIONAL ASSERTIONS**: The Implementer MUST NOT use conditional assertions (e.g., `if (await locator.isVisible())`, `if (await elements.count() > 0)`). All assertions must be unconditional. If a required element is not present, the test MUST fail.
4. **IMPLEMENT PLAN**: The Implementer MUST rewrite `tests/e2e/tier2.spec.ts` to fully implement the 20 test cases defined in `.agents/e2e_testing_m3/plan.md`.

**Verification Method**
1. Ensure the implementer ran `git checkout app/page.tsx app/globals.css` by checking the Git history or working tree status.
2. Review `tests/e2e/tier2.spec.ts` using `grep_search` to ensure no `if (` statements wrap Playwright assertions.
3. Run the tests using `npx playwright test tests/e2e/tier2.spec.ts`. It is acceptable (and expected) if some tests fail due to actual application bugs.
