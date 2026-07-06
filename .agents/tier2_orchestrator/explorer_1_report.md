# E2E Test Plan: tier2.spec.ts (Boundary & Corner Cases)

## Observation
- `TEST_INFRA.md` requires >= 5 tests per feature for Tier 2.
- Tier 2 testing focuses on Boundary & Corner Cases: responsive sizes, absolute absence of pure black (`#000` or `rgb(0,0,0)`), error inputs in forms.
- `SCOPE.md` reiterates the requirement for generating `tests/e2e/tier2.spec.ts` with >= 5 boundary tests for each of the 4 features (total 20 tests), focusing on validation without execution.

## Logic Chain & Test Design

The test suite will use Playwright. Here is the planned logic for each feature's corner/boundary cases:

### Feature 1: High Fashion Layout & Palette
1. **No Pure Black Check**: Iterate through all DOM elements and compute their styles to ensure `color`, `background-color`, and `border-color` never evaluate to `rgb(0, 0, 0)` or `rgba(0, 0, 0, 1)`.
2. **Ultra-Wide Boundary**: Set viewport to 4K (3840x2160) and verify that the main container's maximum width is constrained, preventing UI from stretching indefinitely.
3. **Extreme Narrow Boundary**: Set viewport to 320x568 (iPhone SE) and verify there is no horizontal overflow (no `overflow-x`) and text does not overlap.
4. **Dynamic Resizing**: Start at 1920x1080 and progressively resize down to 320x568 in 100px increments, checking for horizontal scrollbars or breaking layout shifts at each step.
5. **Accessibility Scaling**: Emulate a 200% font-size scale (or zoom) and verify that text elements remain readable without overlapping adjacent containers.

### Feature 2: Scrollytelling Animations
1. **Rapid Scrolling Thrash**: Programmatically scroll from top to bottom and back to top within 500ms. Verify that animations resolve correctly and elements don't get stuck in a halfway-animated state.
2. **Mid-Scroll Page Reload**: Navigate to a specific Y-offset (e.g., `1500px`), reload the page, and assert that elements that should be visible at this scroll depth are fully visible.
3. **Prefers-Reduced-Motion**: Emulate `prefers-reduced-motion: reduce` in the browser context. Verify that scroll-based elements appear instantly without transition delays.
4. **Trigger Threshold Boundary**: Scroll exactly to 1 pixel above the animation trigger point (element should be hidden/initial state), then scroll 1 pixel below it (element should start animating in).
5. **Horizontal Overflow During Animation**: Verify that framer-motion elements animating in from the sides (e.g., `x: 100`) do not cause a temporary horizontal scrollbar on the `body` or `html`.

### Feature 3: Media Display & Typography
1. **Broken Media Fallback**: Intercept all image and video network requests and abort them. Verify that the layout remains stable and `alt` text or fallback skeleton loaders are visible.
2. **Extreme Text Lengths**: Inject a 200-character un-spaced word into the hero title and paragraph. Verify that the CSS handles it gracefully (e.g., `word-break: break-word`) instead of breaking the flex/grid layout.
3. **Font Loading Failure**: Block all `.woff2` and `.ttf` network requests. Verify that the page text falls back to generic `serif` and `sans-serif` and layout does not completely collapse.
4. **High Pixel Density (Retina)**: Set device scale factor to 3. Verify that the correct high-resolution image variant is requested if `srcset` is utilized.
5. **Autoplay Blocked Recovery**: Simulate a strict autoplay policy. Verify that the background/hero video either displays its static `poster` frame or renders a visible play control, rather than displaying an empty block.

### Feature 4: Lead Generation & CTA
1. **Empty Form Submission**: Submit the form with all fields blank. Assert that required validation errors appear and the network request to Supabase is NOT fired.
2. **Malformed Email Variations**: Input edge-case emails (`plainaddress`, `@example.com`, `user@.com`, `user@com`). Assert that the UI flags them as invalid.
3. **Maximum Input Length Boundary**: Inject exactly 10,000 characters into the text-area and name fields. Verify the browser either truncates the input via `maxLength` or the form gracefully rejects it without crashing.
4. **XSS Payload Validation**: Input script tags (`<script>alert(1)</script>`) and SQL-injection strings (`' OR 1=1;--`). Verify the form handles the input safely and either blocks it on validation or submits it parameterized (no UI breakage).
5. **Network Timeout & 500 Error Simulation**: Intercept the Supabase POST request. Delay it by 10 seconds to verify loading state/spinners. Then return a 500 Internal Server Error and verify the UI shows an appropriate user-facing error message instead of crashing.

## Caveats
- No Playwright setup code is implemented yet.
- Assumes Playwright `route.abort()` and `route.fulfill()` are available for the media/font failure and network timeout tests.
- Assumes the form has standard client-side validation logic that we can test before the request is even fired.

## Conclusion
The planned test suite precisely satisfies the `SCOPE.md` requirements for >=5 boundary tests per feature (20 total) focusing strictly on corner cases (responsive, dark mode/pure black, networking boundaries, and input validation).

## Verification Method
To verify implementation, review `tests/e2e/tier2.spec.ts` when created and ensure these 20 logical checks are present as Playwright test blocks.
