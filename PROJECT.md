# Project: Sara D'Angelo Landing Page

## Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: framer-motion (premium, smooth, luxurious transitions and scroll reveals, High Fashion/Vogue style)
- **Database / Backend**: Supabase
- **Deployment**: Vercel ready
- **Data flow**: Client form -> Server Action -> Supabase Table
- **Media**: Optimized WebP/Video delivered via Next.js `<Image>` and native HTML5 video. Hero video blended with beige/gold (no pure black).
- **Design Language**: Vogue/High Fashion style, "scrollytelling emozionale", immense negative space, asymmetric layouts, serif huge titles, tiny sans uppercase details. Palette: White/cream, warm brown texts, gold/beige accents. NO BLACK OR DARK MODE.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Scaffolding & Setup | Create Next.js app, configure Tailwind, setup folder structure, install dependencies including framer-motion | none | DONE |
| 2 | Media Processing | Process images in "WeTrasfer matrimoni nuovi" to WebP, compress videos, place in public/media | none | DONE |
| 3 | Supabase Integration | Set up Supabase client, create table schema (locally/docs), create Server Actions for form submission | M1 | DONE |
| 4 | UI Overhaul | Total redesign: Scrollytelling, High Fashion layout, emotional copywriting, strict palette (white/cream/beige/gold/brown). Redo all components in `components/`. | M1, M2 | IN_PROGRESS |
| 5 | Performance & Polish | Lighthouse audits, responsive fixes, ensure Vercel ready | M3, M4 | PLANNED |

## Interface Contracts
### Client ↔ Supabase (Server Action)
- `saveLead(email: string): Promise<{ success: boolean; error?: string }>`

## Code Layout
- `app/`: Next.js app router pages and layouts
- `components/`: React components (Hero, Portfolio, Form, etc.)
- `lib/`: Supabase client and shared utilities
- `public/media/`: Optimized images and videos
