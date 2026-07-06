# Fix Strategy for Tier 1 E2E Tests

## Observation
An analysis of `tests/e2e/tier1.spec.ts` reveals a systematic use of conditional statements to bypass Playwright assertions. Specifically, locators are queried using `await locator.count() > 0`, and assertions are nested inside these `if` blocks. If the target element is absent from the DOM, the `if` condition evaluates to false, the assertions are entirely skipped, and the test incorrectly passes.

Examples found:
- **Test 3 & 4 (Sections)**: `if (await section.count() > 0)` for `#hero`, `#metodo`, etc.
- **Test 6 & 7 (Hero/Metodo)**: `if (await hero.count() > 0) { await expect(...).toBeVisible(); }`
- **Test 13 (Hero Video)**: `if (await heroVideo.count() > 0) { await expect(...).toBeAttached(); }`
- **Test 16-20 (Lead Gen)**: `if (await emailForm.count() > 0)` and `if (await calendlyCTA.count() > 0)`

## Logic Chain
1. Playwright's core philosophy relies on "auto-waiting" assertions (e.g., `await expect(locator).toBeVisible()`). These assertions automatically wait for an element to satisfy a condition, failing the test if the timeout is reached.
2. Wrapping assertions in an `if (await locator.count() > 0)` circumvents this auto-waiting mechanism. It immediately resolves the existence check, and if the element hasn't rendered yet (or is missing entirely due to broken functionality), the test silently exits and passes.
3. To enforce test integrity, we must require the tests to unconditionally assert the existence and state of critical DOM elements. 
4. If an element is part of a list/collection (e.g., gallery items or headings), the test must explicitly assert that the collection is not empty before iterating.

## Caveats
- Removing conditionals means the tests will now strictly fail if the implementation is missing or incomplete. This is the desired behavior, but it will turn the current false "passes" into genuine "fails" until the frontend code actually implements the required features.
- If certain elements are genuinely intended to be optional depending on the environment, separate specific tests should be created, rather than silencing failures using `count() > 0`. For this project, all sections (`#hero`, `#metodo`, etc.) and the form/video elements are strictly required.

## Conclusion
The test suite must be rewritten to remove all `if (await element.count() > 0)` conditionals and instead rely unconditionally on Playwright's `expect` matchers.

### Implementation Strategy

1. **Remove Conditional Wrappers**: Delete all `if (await locator.count() > 0)` and `if (count > 0)` blocks across the suite.
2. **Unconditional Assertions**: Elevate the enclosed assertions so they execute directly. Use Playwright's built-in web-first assertions, e.g.:
   - Replace:
     ```typescript
     if (await hero.count() > 0) {
       await expect(hero).toBeVisible();
     }
     ```
   - With:
     ```typescript
     await expect(hero).toBeVisible();
     ```
3. **Handle Collections & Loops**: When asserting properties on a list of elements (e.g., Test 8 Gallery Items, Test 11 Headings), unconditionally assert that elements exist before looping:
   ```typescript
   // Ensure there is at least one item before attempting to loop
   const galleryItems = portfolio.locator('.gallery-item, img');
   await expect(galleryItems.first()).toBeVisible(); // forces wait
   const count = await galleryItems.count();
   expect(count).toBeGreaterThan(0);
   for (let i = 0; i < count; i++) {
     await expect(galleryItems.nth(i)).toHaveCSS('opacity', '1');
   }
   ```
4. **Remove Fallback `else` logic**: In Test 10 (Parallax), remove the `else` block entirely. The parallax background element must be unconditionally expected to exist and transform on scroll.
5. **Enforce Lead Gen Form Requirements**: In Tests 16-20, unconditionally target `emailForm` and `calendlyCTA`. The tests must fail if these lead generation tools are absent.
6. **Expect List Check**: In Test 15 (Performance Loading), assert that lazy-loaded images exist using `await expect(lazyImages).not.toHaveCount(0);` instead of bypassing the assertion when `count === 0`.

## Verification Method
1. The implementer must modify `tests/e2e/tier1.spec.ts`.
2. Run `npx playwright test tests/e2e/tier1.spec.ts` (or the equivalent test command). 
3. Verify that the file no longer contains the string `.count() > 0` inside an `if` statement.
4. Verify that running the tests against an empty or unimplemented page yields `FAIL` for all layout and behavior checks, confirming the tests are properly asserting functionality.
