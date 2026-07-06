# Tier 1 Test Fix Strategy (Iteration 2)

## Goal
Rewrite `tests/e2e/tier1.spec.ts` to implement GENUINE assertions and completely eliminate all facade tests (tautologies).

## Rules for Rewrite
1. **NO CONDITIONALS**: Remove all `if (await locator.isVisible())`, `if (await locator.count() > 0)`, or similar conditionals guarding assertions. If an element does not exist, the test MUST fail. That is the point of an E2E test.
2. **STRICT VISIBILITY**: For visibility checks, call `await expect(locator).toBeVisible();` directly. Do not wrap it.
3. **STRICT FORMAT CHECKING**: For the image format check (`isModernFormat`), do not use `if (isModernFormat)`. Directly assert `expect(isModernFormat).toBe(true);`. If no images load, the test must fail.
4. **STRICT OPACITY TRANSITIONS**: To test scroll reveals, check the element's initial state (e.g. `await expect(locator).toHaveCSS('opacity', '0')`), then perform the scroll, then wait and assert the final state (e.g. `await expect(locator).toHaveCSS('opacity', '1')`). Do NOT use `if (await isVisible())` and do NOT assert that a visible element has opacity > 0 (tautology).
5. **STRICT HOVER TRANSITIONS**: Ensure that hover states evaluate genuine CSS changes using auto-retrying matchers if possible, or strict before/after comparisons without `if` wrappers.

The Worker must rewrite the 20 tests previously defined in `tier1.spec.ts` strictly adhering to these rules.
