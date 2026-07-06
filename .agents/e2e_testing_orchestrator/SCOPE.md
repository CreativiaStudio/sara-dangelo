# Scope: E2E Test Suite Creation

## Architecture
- Playwright for E2E testing
- Tests written in TypeScript under `tests/e2e/`
- Independent execution: tests should run against `localhost:3000` (or configured base URL)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Playwright Setup | Initialize Playwright, create playwright.config.ts, setup folder structure, configure base URL. | none | DONE |
| 2 | Tier 1 Tests | Implement Feature Coverage tests (≥5 per feature). | M1 | PLANNED |
| 3 | Tier 2 Tests | Implement Boundary & Corner cases (≥5 per feature, e.g. color checks for black, responsive sizing). | M1 | PLANNED |
| 4 | Tier 3 Tests | Implement Cross-Feature tests (pairwise coverage). | M1 | DONE |
| 5 | Tier 4 Tests | Implement Real-World Application Scenarios (visitor journeys). | M1 | PLANNED |

## Interface Contracts
### Tests ↔ App
- Tests must be opaque-box. They assert DOM elements, CSS properties, visual layout, animations, network calls (Supabase requests, but without importing implementation files).
