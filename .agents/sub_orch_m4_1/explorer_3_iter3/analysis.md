# High Fashion Palette Synthesis

## Overview
The High Fashion aesthetic for Sara D'Angelo replaces harsh blacks (`#000`, `#111`, `#0A0A0A`) with deep, warm, elegant browns (primarily `#4A3B32`) to convey luxury and warmth.

## Findings
An exhaustive search of the `components` and `app` directories reveals that lingering traces of black are isolated to `components/PortfolioSection.tsx`.

### Offending Code & Exact Replacements

| File | Line | Original Class | Recommended Replacement | Rationale |
|---|---|---|---|---|
| `components/PortfolioSection.tsx` | 53 | `bg-[#111]` | `bg-[#4A3B32]` | Main section background should use the primary High Fashion brown. |
| `components/PortfolioSection.tsx` | 94 | `bg-black/60` | `bg-[#4A3B32]/60` | Overlay when active. |
| `components/PortfolioSection.tsx` | 94 | `bg-black/40` | `bg-[#4A3B32]/40` | Default overlay. |
| `components/PortfolioSection.tsx` | 94 | `group-hover:bg-black/20` | `group-hover:bg-[#4A3B32]/20` | Hover overlay. |
| `components/PortfolioSection.tsx` | 115 | `bg-[#0A0A0A]` | `bg-[#3D312A]` | Expanded gallery background. `#3D312A` (a darker shade of `#4A3B32`) maintains depth without reverting to black. |
| `components/PortfolioSection.tsx` | 139 | `from-black/80` | `from-[#4A3B32]/80` | Gradient overlay on images on hover. |

## Conclusion
By applying these exact class replacements, the `PortfolioSection.tsx` will be fully aligned with the High Fashion aesthetic, removing all harsh blacks while maintaining the desired visual depth and contrast.
