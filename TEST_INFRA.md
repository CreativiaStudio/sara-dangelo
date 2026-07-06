# E2E Test Infra: Sara D'Angelo Landing Page

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | High Fashion Layout & Palette | ORIGINAL_REQUEST / PROJECT.md (White/cream/beige/gold/brown, NO BLACK) | 5 | 5 | ✓ |
| 2 | Scrollytelling Animations | ORIGINAL_REQUEST / PROJECT.md (Framer-motion scroll reveals, transitions) | 5 | 5 | ✓ |
| 3 | Media Display & Typography | ORIGINAL_REQUEST / PROJECT.md (Serif titles, sans-serif details, WebP/Video) | 5 | 5 | ✓ |
| 4 | Lead Generation & CTA | ORIGINAL_REQUEST (Supabase integration, Form submission, Calendly redirect) | 5 | 5 | ✓ |

## Test Architecture
- Test runner: `npx playwright test` (Playwright for E2E)
- Test case format: Playwright test spec files (`.spec.ts`) in `tests/e2e/`
- Directory layout: Tests should be placed under `tests/e2e/` broken down by feature/tier.
- Expected: all tests pass with exit code 0.

## Coverage Thresholds
- Tier 1: ≥5 per feature (Feature Coverage - happy paths)
- Tier 2: ≥5 per feature (Boundary & Corner Cases - responsive, no pure black, error inputs)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios (Visitor journey)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Visitor explores full page (triggering animations) and submits lead form successfully | F1, F2, F3, F4 | High |
| 2 | Mobile visitor navigates layout, reads typography, and attempts to submit invalid email | F1, F3, F4 | Medium |
| 3 | Visitor quickly scrolls through the page, validating performance of media and animations | F2, F3 | Medium |
| 4 | Visitor clicks Calendly CTA redirect, bypassing the lead generation form | F1, F4 | Medium |
| 5 | Network delay simulation during form submission on high-fashion responsive layout | F1, F4 | High |
