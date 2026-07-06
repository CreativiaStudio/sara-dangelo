# Scope: Milestone 4 (UI Overhaul)

## Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: framer-motion (premium, smooth, luxurious transitions, scrollytelling, High Fashion/Vogue style)
- **Design Language**: 
  - Immense negative space, asymmetric layouts.
  - Huge Serif typography for emotion, tiny spaced Sans uppercase for details.
  - Strict Palette: White/cream backgrounds (`#FDFBF7`), warm brown texts (`#4A3B32`), gold/beige accents. **NO BLACK OR DARK MODE**.
  - Media: Soft blending of videos/images with beige/gold tones.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Global Setup & Hero | Update globals.css/layout.tsx to enforce palette (warm brown text `#4A3B32`, no #2A2A2A). Redesign `HeroSection.tsx` and `Navbar.tsx` (scrollytelling, blended video, emotional copy). | none | DONE |
| 2 | Story & Method | Redesign `MethodSection.tsx` and `PortfolioSection.tsx` into an emotional, magazine-style scrollytelling experience. Asymmetric layouts, parallax. | M1 | PLANNED |
| 3 | Reviews & Form | Redesign `ReviewsSection.tsx` and `DoubleFunnelSection.tsx`. Elegant typography, floating inputs. | M2 | PLANNED |

## Interface Contracts
### Global Palette
- Background: `#FDFBF7`
- Text: `#4A3B32` (warm brown)
- Gold: `#D4AF37`, `#B5952F`

### Component Contracts
- No props change required for the sections inside `app/page.tsx`.
- Form action `saveLead` remains untouched.
