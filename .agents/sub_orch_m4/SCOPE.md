# Scope: UI Development (Milestone 4)

## Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, warm neutrals (crema, beige, panna), gold/bronze accents. Elegant serif for titles, clean sans-serif for paragraphs. Asymmetrical gallery for the portfolio.
- **Animations**: framer-motion (premium, smooth, luxurious transitions and scroll reveals).
- **Database / Backend**: Supabase (already configured in `lib/supabase` and `app/actions/saveLead.ts`).
- **Data flow**: Client form -> Server Action -> Supabase Table.
- **Media**: Optimized WebP/Video in `public/media`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | UI Implementation | Develop Hero (video bg), Method, Portfolio (12 photos), Reviews, Double Funnel (Supabase action + Calendly embed) sections | M1, M2, M3 | IN_PROGRESS |

## Interface Contracts
### Client ↔ Supabase (Server Action)
- `saveLead(email: string): Promise<{ success: boolean; error?: string }>` (Already implemented)

## Code Layout
- `app/`: Next.js app router pages and layouts
- `components/`: React components
- `lib/`: Shared utilities
- `public/media/`: Optimized images and videos
