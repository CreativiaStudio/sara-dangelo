# Tier 3 E2E Test Cases - Pairwise Combinations

## Observation
We need to generate Tier 3 E2E test cases based on a pairwise combination of four core features defined in `TEST_INFRA.md` and `SCOPE.md`:
- F1: High Fashion Layout & Palette
- F2: Scrollytelling Animations
- F3: Media Display & Typography
- F4: Lead Generation & CTA

## Logic Chain
To achieve pairwise coverage (all possible pairs between F1, F2, F3, F4), we have exactly 6 unique pairs: (F1, F2), (F1, F3), (F1, F4), (F2, F3), (F2, F4), and (F3, F4). 
For each pair, a dedicated test case that explicitly exercises the intersection of those two features ensures cross-feature functionality. 

Here are the recommended test cases for `tests/e2e/tier3.spec.ts`:

1. **Test Case 1: Layout + Scrollytelling (F1 & F2)**
   - *Description*: Verify that scrollytelling animations (fade-ins, transforms) trigger accurately across both desktop and mobile layouts, maintaining the correct trigger offsets without horizontal overflow.

2. **Test Case 2: Layout + Media (F1 & F3)**
   - *Description*: Ensure media elements (WebP/Video) are responsive and maintain aspect ratios within the high fashion layout across different viewports. Verify typography (serif/sans-serif) scales correctly without breaking layout constraints.

3. **Test Case 3: Layout + Lead Gen (F1 & F4)**
   - *Description*: Validate that the Lead Generation form and CTA buttons are accessible, correctly styled (no pure black, using the designated palette), and properly positioned in both desktop and mobile layouts.

4. **Test Case 4: Scrollytelling + Media (F2 & F3)**
   - *Description*: Verify that media elements (images, videos) lazy-load or animate into view smoothly based on scrollytelling triggers without layout shifts or typography flickering.

5. **Test Case 5: Scrollytelling + Lead Gen (F2 & F4)**
   - *Description*: Test that the Lead Gen form or primary CTA button animates into view smoothly upon scrolling to its section and is immediately interactive and clickable.

6. **Test Case 6: Media + Lead Gen (F3 & F4)**
   - *Description*: Interact with the Lead Generation form (inputting data) while background/adjacent media plays or renders. Verify that form inputs remain focused and readable against the media or typography backdrop.

## Caveats
- These tests are opaque-box and focus strictly on behavioral interactions. Implementation details (like specific Framer Motion hooks) are not assumed.
- Responsiveness (mobile vs. desktop) is used as a primary variable for Layout (F1).

## Conclusion
The 6 pairwise combinations have been mapped to specific test cases to be implemented in `tests/e2e/tier3.spec.ts`. These cover all interactions between the Layout, Scrollytelling, Media, and Lead Gen features as required by the testing architecture.

## Verification Method
- Ensure the implementer creates `tests/e2e/tier3.spec.ts` with these 6 scenarios.
- Run `npx playwright test tests/e2e/tier3.spec.ts` to verify the tests execute properly and pass against the application.
