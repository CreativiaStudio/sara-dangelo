# E2E Testing Strategy: Tier 3 & Tier 4

## 1. Observation
- `TEST_INFRA.md` defines four features: F1 (Lead Gen Form), F2 (Media Optimization), F3 (Responsive Layout), and F4 (Scroll Animations).
- `TEST_INFRA.md` dictates Tier 3 as "pairwise cross-feature testing" and Tier 4 as "≥5 realistic application scenarios" (explicitly listed in a table).
- Inspection of `tests/e2e/tier1.spec.ts` shows coverage of basic feature functionality in isolation.
- Inspection of `tests/e2e/tier2.spec.ts` shows coverage of extreme bounds (XSS, massive viewports, rapid interactions, network failures) in isolation.
- No tests currently combine multiple features purposefully to check their integration constraints, nor do they simulate full chronological user journeys.

## 2. Logic Chain
- Because Tier 1 and 2 operate in isolation, Tier 3 must strictly target the intersections of F1, F2, F3, and F4 to catch integration bugs (e.g., animations blocking clicks, media breaking layouts).
- We can achieve coverage by testing the following pairs:
  - F1 + F3: Form behavior on Mobile constraints.
  - F2 + F3: Media responsiveness on viewport changes.
  - F1 + F4: Form interaction post-animation reveal.
  - F4 + F3: Scroll animations under mobile vertical stacking.
  - F2 + F4: Concurrent media lazy-loading and reveal animations.
- For Tier 4, `TEST_INFRA.md` already mandates 5 specific scenarios. To make this actionable for the implementer, these must be translated into procedural Playwright steps that string together navigation, scrolling, waiting, and assertions.

## 3. Caveats
- Assumptions are made about exact DOM behavior (e.g., that animations use opacity/transforms rather than display toggles). The implementer may need to adjust the exact CSS property checks (`opacity: 1`, `pointer-events: auto`).
- The mobile tests assume a standard viewport size (e.g., 375x667). 
- Network delay simulation assumes standard Playwright routing capabilities intercepting the API endpoints (`/api/supabase` or similar).

## 4. Conclusion
The implementer should create two new files: `tier3.spec.ts` and `tier4.spec.ts`.

### Outline for `tier3.spec.ts` (Pairwise Testing)
1. **F1 (Form) + F3 (Layout)**: *Mobile Form Layout Integrity*
   - Set viewport to mobile. Navigate to the form. Focus on the email input. Verify the form container does not exceed `window.innerWidth` and remains fully visible.
2. **F2 (Media) + F3 (Layout)**: *Media Scaling on Orientation Change*
   - Set viewport to mobile portrait. Measure hero video aspect/size. Switch to landscape. Verify the video resizes correctly (e.g., `object-fit: cover` maintains aspect ratio without overflow).
3. **F1 (Form) + F4 (Animations)**: *Form Interactivity Post-Reveal*
   - Load page. Scroll rapidly to the form section. Wait for the scroll animation to finish (e.g., opacity reaches 1). Verify the email input is explicitly clickable and not blocked by animation wrappers.
4. **F4 (Animations) + F3 (Layout)**: *Scroll Triggers on Mobile Stacking*
   - Set viewport to mobile (sections are taller). Scroll down. Verify that animations still trigger accurately at the mobile scroll offsets, ensuring elements aren't trapped off-screen.
5. **F2 (Media) + F4 (Animations)**: *Concurrent Lazy-Load and Fade-In*
   - Scroll to the portfolio section. Verify that as the Framer Motion animation fades the container in, the `loading="lazy"` images correctly trigger network requests and render simultaneously without tearing.

### Outline for `tier4.spec.ts` (Real-World Scenarios)
1. **Scenario 1: Full Journey (Happy Path)**
   - Land on page -> wait for hero video -> scroll slowly through "Metodo" and "Portfolio" -> hover a portfolio item -> scroll to Funnel -> fill valid email -> submit -> verify success message.
2. **Scenario 2: Mobile Portfolio & Invalid Form Correction**
   - Set mobile viewport -> open hamburger menu -> click "Portfolio" (deep link) -> view gallery -> scroll to Funnel -> submit empty/invalid email -> see validation errors -> fix email -> submit -> verify success.
3. **Scenario 3: Rapid Window Shopping (No Conversion)**
   - Land on page -> rapidly scroll to footer -> rapidly scroll back to top -> ensure hero video is still playing, portfolio images are present, and no sections are stuck in `opacity: 0` states due to race conditions.
4. **Scenario 4: Double Submission Journey**
   - Scroll to form -> submit valid email -> see success -> interact with form again -> attempt to submit a second time -> verify the system gracefully prevents/handles duplicate submissions (e.g., button disabled or duplicate success message).
5. **Scenario 5: High Latency Submission**
   - Apply a Playwright route delay (e.g., 3 seconds) to the submission API. Fill valid form -> click submit -> assert the presence of a loading state/spinner -> wait for API response -> assert success message appears.

## 5. Verification Method
1. The implementer writes `tests/e2e/tier3.spec.ts` and `tests/e2e/tier4.spec.ts` matching the outlines.
2. Run `npx playwright test tests/e2e/tier3.spec.ts tests/e2e/tier4.spec.ts`.
3. Success is defined by an exit code of `0` and all tests passing in standard CI configurations.
