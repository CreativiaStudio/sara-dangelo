# Project: Sara D'Angelo Luxury Wedding Switcher & Auto-Scroll Navigation

## Architecture
- **Framework & Runtime**: Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript 5, Tailwind CSS v4, Framer Motion 12.40.0, Lucide React icons.
- **Section & Component Stacking**:
  - `components/Navbar.tsx`: Fixed top-0, z-50, hide-on-scroll-down, show-on-scroll-up. Height: 68px–88px.
  - `components/PortfolioSection.tsx`: `#portfolio` section container (background: `#2A2118` dark luxury).
  - `components/PortfolioSwitcher.tsx` (or embedded in `PortfolioSection.tsx`): Sticky / Floating switcher bar (`z-40`, sticky top positioning `top-0` or `top-[80px]`, glassmorphism `backdrop-blur-md bg-[#2A2118]/85`, border `#B89768/20`, active gold pill/underline indicator with Framer Motion `layoutId`).
  - Photo Gallery Grid: Responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), instant dataset switch without `mode="wait"` blocking freeze, aspect-ratio placeholder frames (`bg-[#1A140E]`) with 0 Cumulative Layout Shift (CLS).
  - Lightbox Modal: `fixed inset-0 z-[60] bg-[#1A140E]/95` (elevated z-index above navbar & sticky switcher).
  - `CustomCursor.tsx`: `fixed z-[9999] pointer-events-none`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Sticky Contextual Switcher Bar (R1) | Sticky / floating navigation bar pinned inside `#portfolio` section, visible throughout portfolio scrolling and automatically un-pinned/hidden outside `#portfolio`. Active wedding pill highlighted with luxury gold styling. | M1 | ORIGINAL_REQUEST.md § R1 |
| F2 | One-Click Instant Switch & Auto-Scroll (R2) | Immediate gallery dataset update on click/tap, concurrent smooth auto-scroll to the top of the photo grid offset by fixed navbar + sticky bar heights (~156px clearance) so the first photo is in full view. | M1 | ORIGINAL_REQUEST.md § R2 |
| F3 | Mobile-First Luxury Ergonomics (R3) | Horizontal swipeable pill bar with momentum touch scrolling (`-webkit-overflow-scrolling: touch`), hidden scrollbars (`no-scrollbar`), tap-to-center active element (`scrollIntoView`), touch targets ≥44px, zero layout shift. | M1 | ORIGINAL_REQUEST.md § R3 |
| F4 | Desktop Luxury Aesthetic & Motion (R4) | Dark luxury palette (`#2A2118`, `#B89768`, `#FDFBF7`, `#1A140E`), glassmorphic backdrop blur, smooth spring layout animation for active indicator, gold accents and refined typography. | M1 | ORIGINAL_REQUEST.md § R4 |
| F5 | Production Verification & Git Integration | Full production build (`npm run build`) with 0 errors, full cross-viewport compatibility, commit and push to origin/master. | M1 | ORIGINAL_REQUEST.md |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Luxury Sticky Switcher & Auto-Scroll Navigation | Implement sticky switcher, auto-scroll offset calculation, mobile swipe/tap-to-center ergonomics, luxury styling, zero-CLS dataset switching, build check, and git push. | none | IN_PROGRESS |

## Interface Contracts
### `PortfolioSection` ↔ `PortfolioSwitcher` / Sticky Bar
- **Data Input**: `albums: Array<{ key: string, title: string, subtitle?: string, location?: string, count: number }>`
- **Active State**: `activeTab: string`
- **State Change Handler**: `onSelectWedding: (key: string) => void`
  - Switches active dataset in React state immediately.
  - Calculates photo grid bounding rectangle and smoothly scrolls window to `gridTop - (navbarHeight + switcherHeight + buffer)` (~156px).
  - On mobile, triggers `element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })` on the active pill button.
- **Scroll Target Reference**: `photoGridRef: React.RefObject<HTMLDivElement>`

## Code Layout
- `components/PortfolioSection.tsx`: Main portfolio section component containing gallery grid, sticky switcher integration, lightbox, and scroll refs.
- `components/PortfolioSwitcher.tsx` (optional subcomponent): Standalone reusable sticky switcher component or embedded clean modular subcomponent.
- `app/globals.css`: Global styles, CSS variables, `no-scrollbar` utility classes for smooth momentum touch scroll.
- `public/media/albums/manifest.json`: Authoritative dataset containing all 6 wedding albums and photo metadata.
