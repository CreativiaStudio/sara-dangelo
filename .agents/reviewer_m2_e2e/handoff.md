# Handoff Report: E2E Testing M2 Tier 1 Tests (Iteration 2)

## Observation
I reviewed the file `tests/e2e/tier1.spec.ts` against the requirements in `test_plan_v2.md` and `TEST_INFRA.md`.
1. Out of 20 tests, 19 have successfully had their tautologies and facade assertions removed. The tests now correctly fail because they use strict assertions like `await expect(locator).toBeVisible();`.
2. However, in Test 5 (`should successfully redirect or open the Calendly modal when clicking the secondary CTA`), the following code is present:
```typescript
      if (popup) {
        expect(popup.url()).toContain('calendly');
      } else {
        const url = page.url();
        if (url.includes('calendly')) {
          expect(url).toContain('calendly');
        } else {
          const calendlyIframe = page.locator('iframe[src*="calendly"]');
          await expect(calendlyIframe).toBeVisible();
        }
      }
```
3. In Test 10 (`should request and serve portfolio images in WebP or AVIF format`), the test checks the content type of ANY image response without filtering for the application's domain or specific portfolio image paths.

## Logic Chain
1. Rule 1 in `test_plan_v2.md` explicitly states: "NO CONDITIONALS: Remove all conditionals guarding assertions." The `if/else` block in Test 5 directly violates this rule by guarding the assertions based on the test's execution state.
2. The core goal of Iteration 2 was to "completely eliminate all facade tests (tautologies)." The block `if (url.includes('calendly')) { expect(url).toContain('calendly'); }` in Test 5 is a literal tautology. If the condition is met, the assertion is mathematically guaranteed to pass, effectively testing nothing within that branch.
3. From an adversarial perspective, Test 10 introduces a false positive risk. If a third-party pixel or tracking script loads a WebP image, `isModernFormat` will evaluate to `true` and the test will pass, even if the actual portfolio images are unoptimized JPEGs. The event listener must filter for requests originating from the app (e.g., `_next/image` or the app's domain).

## Caveats
- The use of `if` inside the event listener in Test 10 is necessary and not a violation of Rule 1, as it does not guard an assertion but rather filters events. The problem there is just insufficient filtering logic.
- Testing multiple possible implementations (popup vs redirect vs iframe) in Test 5 is understandable given the "opaque-box" philosophy, but it must be achieved without branching logic or tautologies (e.g., by computing a final boolean and asserting it once).

## Conclusion
**Verdict**: REQUEST_CHANGES (Fail)
The implementer made massive improvements, but the presence of a literal tautology and conditional branching in Test 5 violates the primary goal and Rule 1 of Iteration 2. Additionally, Test 10 contains a critical vulnerability that could lead to false positives.

**Next Steps**:
1. Rewrite Test 5 to eliminate the `if/else` branching and the tautological assertion. Calculate a boolean representing success across the three methods, and assert it unconditionally.
2. Update the network interception logic in Test 10 to ensure the matched image response is actually a portfolio image (e.g., by checking `response.url()`).

## Verification Method
1. Run `npx playwright test tests/e2e/tier1.spec.ts` and inspect the code for Test 5 to ensure no `if` statements remain.
2. Verify that Test 10's event listener checks `response.url()`.
