# E2E Milestone 4: Tier 3 & 4 Test Strategy

## Overview
This document outlines the testing strategy and specific test cases for Tier 3 (Pairwise Cross-Feature Testing) and Tier 4 (Real-World Application Scenarios) for the Sara D'Angelo Landing Page.

## Tier 3 Strategy: Pairwise Cross-Feature Testing
We need to ensure that the interactions between the 4 core features do not introduce regressions. Pairwise testing reduces the combinatorial explosion while guaranteeing that every pair of features is tested together at least once.

### Feature Inventory Review
*   **F1**: Lead Generation Form
*   **F2**: Media Optimization (WebP/Video)
*   **F3**: Responsive Layout & Sections
*   **F4**: Scroll Animations

### Proposed Tier 3 Test Cases

1.  **T3.1: F1 (Lead Gen) x F3 (Responsive)**
    *   *Test*: "Submit form on mobile view with virtual keyboard simulation."
    *   *Action*: Load page in mobile viewport. Scroll to the lead gen form. Focus an input to simulate keyboard presence. Attempt to submit with invalid data, then valid data.
    *   *Check*: Ensure validation errors are visible and the submit button is accessible without horizontal scrolling or layout breakages.
2.  **T3.2: F1 (Lead Gen) x F4 (Animations)**
    *   *Test*: "Form interacts smoothly with scroll animations."
    *   *Action*: Scroll to the lead generation form to trigger its reveal animation. Immediately attempt to fill and submit the form while the animation is completing.
    *   *Check*: Form inputs must be intractable during/immediately after animation, and validation feedback must not cause layout shifts that disrupt the animation state.
3.  **T3.3: F2 (Media) x F3 (Responsive)**
    *   *Test*: "Media scaling and lazy loading across breakpoints."
    *   *Action*: Resize the window from desktop (1920x1080) down to mobile (375x667) and back, while observing the hero video and portfolio lazy-loaded images.
    *   *Check*: Video maintains `object-fit: cover` and images re-request appropriate sizes without layout thrashing. Lazy loading should trigger correctly based on the mobile scroll position.
4.  **T3.4: F2 (Media) x F4 (Animations)**
    *   *Test*: "Portfolio hover animations on lazy-loaded images."
    *   *Action*: Scroll down to the portfolio section so images lazy load. Once loaded, trigger the hover animation.
    *   *Check*: Hover animations (transform/scale) must execute smoothly without waiting for additional media loads or causing flickering.
5.  **T3.5: F3 (Responsive) x F4 (Animations)**
    *   *Test*: "Scroll animations trigger at correct offsets on mobile."
    *   *Action*: Load the page in a mobile viewport (where elements stack vertically). Scroll down slowly.
    *   *Check*: Elements (like "Metodo" and "Portfolio") should fade in/animate only when they enter the mobile viewport, not prematurely based on desktop offsets.

## Tier 4 Strategy: Real-World Scenarios
Tier 4 focuses on end-to-end user journeys mirroring actual business requirements, involving multiple steps, feature interactions, and varying network conditions.

### Proposed Tier 4 Test Cases

1.  **T4.1: The "Golden Path" Conversion (High Complexity - F1, F2, F3, F4)**
    *   *Scenario*: Visitor explores the full landing page and submits the lead form successfully.
    *   *Steps*: Load desktop page -> Watch hero video for 2s -> Scroll down revealing "Metodo" -> Hover over a portfolio item -> Scroll to "Funnel/Lead Gen" -> Fill valid email -> Submit -> See success message.
2.  **T4.2: Mobile Bounce Journey (Medium Complexity - F1, F2, F3)**
    *   *Scenario*: Visitor on mobile views portfolio and attempts to submit an invalid email.
    *   *Steps*: Load mobile viewport -> Scroll past hero video -> Open mobile menu -> Navigate to Portfolio -> Scroll to Lead form -> Enter "bad_email" -> Submit -> Assert validation error -> Scroll back up.
3.  **T4.3: The Window Shopper (Medium Complexity - F2, F3, F4)**
    *   *Scenario*: Visitor quickly scrolls through the page, triggering all animations, but doesn't submit.
    *   *Steps*: Load page -> Rapidly scroll to the very bottom -> Assert that all sections (Social Proof, Portfolio) animated into view -> Verify no network request for form submission was triggered.
4.  **T4.4: The Persistent Submitter (Medium Complexity - F1, F3)**
    *   *Scenario*: Visitor submits form, gets success, then tries to submit again.
    *   *Steps*: Scroll to form -> Submit valid data -> Assert success message -> Try to modify input and submit again -> Assert double submission is prevented or form is locked out gracefully.
5.  **T4.5: The Train Tunnel (Medium Complexity - F1)**
    *   *Scenario*: Network delay during form submission (simulated).
    *   *Steps*: Fill out lead form with valid data -> Enable simulated network delay (e.g., 5 seconds) -> Click Submit -> Assert loading state/spinner is visible on the button -> Assert success message appears after delay.
