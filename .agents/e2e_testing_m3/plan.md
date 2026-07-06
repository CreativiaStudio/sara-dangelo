# Tier 2 E2E Tests Plan

## Implementation Target
`tests/e2e/tier2.spec.ts`

## Requirements
Implement the following 20 test cases using Playwright. Use robust locators (`data-testid`, roles). The tests must follow the opaque-box philosophy. If you need to add `data-testid` to the source code to make tests robust, you are allowed to do so.

### Feature 1: Lead Generation Form
1. **Empty Submission**: Submit without filling fields. Verify validation errors, no network request.
2. **Invalid Email Format**: Valid name, invalid email. Verify validation rejects input.
3. **Double Submission Prevention**: Fill correctly, click submit 5 times rapidly. Verify only 1 network request is sent to Supabase and button disables.
4. **Network Failure Graceful Handling**: Route the Supabase POST request to abort/500. Verify UI shows graceful error.
5. **Malicious Input (XSS)**: Enter `<script>alert('xss')</script>` in name. Verify safe submission.

### Feature 2: Media Optimization
1. **Video Autoplay Fallback**: Emulate context with autoplay disabled. Verify `<video>` shows `poster`.
2. **Lazy Loading Bounds**: Load page, no scroll. Verify images in Portfolio/Social Proof are NOT fetched (via network interceptor) until scrolled.
3. **Slow Network Simulation**: Emulate Slow 3G. Verify placeholders (`blurDataURL`/skeletons) are visible while loading.
4. **Extremely Large Viewport**: Resize to 3840x2160. Verify Hero video background scales (`object-cover`) without white borders.
5. **Image Failure Fallback**: Intercept and abort a portfolio image request. Verify layout doesn't break, `alt` or fallback renders.

### Feature 3: Responsive Layout
1. **Minimum Width Constraints**: Viewport 320px. Verify no horizontal scrolling (`document.documentElement.scrollWidth === window.innerWidth`).
2. **Orientation Change Adjustment**: Viewport 768x1024 -> resize to 1024x768. Verify grid/flex updates gracefully.
3. **Mobile Menu Toggle State**: Open mobile menu at 375px, resize to 1200px. Verify mobile menu disappears, desktop nav shows.
4. **Huge Font Size**: Inject `html { font-size: 200% !important; }`. Verify CTA button/hero text don't clip out of containers.
5. **Non-Standard Breakpoint**: Viewport 850px. Verify portfolio columns don't leave elements dangling.

### Feature 4: Scroll Animations
1. **Reduced Motion Preference**: Launch context with `prefers-reduced-motion: reduce`. Verify animated elements appear immediately.
2. **Rapid Yoyo Scrolling**: Scroll top to bottom in 100ms, back to top. Verify elements return to correct states.
3. **Deep Link Initialization**: Navigate to `/#portfolio`. Verify elements are visible immediately.
4. **Resize During Animation**: Scroll to trigger animation, resize window before it finishes. Verify elements settle correctly.
5. **Touch Device Hover Fallback**: Emulate touch device. Verify hover-hidden info is visible or safely triggered by tap.
