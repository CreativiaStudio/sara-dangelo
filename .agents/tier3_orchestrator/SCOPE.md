# Scope: Tier 3 E2E Tests

## Architecture
- Playwright E2E tests for Cross-Feature Combinations (Tier 3).
- Test file: `tests/e2e/tier3.spec.ts`
- Feature pairwise matrix based on `TEST_INFRA.md`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Tier 3 Tests | Implement pairwise coverage of major feature interactions (e.g. form + mobile layout, scroll + media) | none | DONE |

## Interface Contracts
- Playwright test specs must be syntactically valid TypeScript.
- The tests are completely opaque-box.
