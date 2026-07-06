# Scope: Tier 4 E2E Tests

## Architecture
- Tier 4 Tests focus on Real-World Application Scenarios (Visitor journeys).
- Implementation is confined to `tests/e2e/tier4.spec.ts`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Tier 4 Scenarios | Implement 5 scenarios from TEST_INFRA.md in tier4.spec.ts | none | PLANNED |

## Interface Contracts
- Tests must be valid TypeScript for Playwright (`@playwright/test`).
- Must not run the tests against the application (just write them).
- Must align exactly with the 5 scenarios described in `TEST_INFRA.md`.
