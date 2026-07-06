# Scope: Supabase Integration (Milestone 3)

## Architecture
- Setup Supabase client in Next.js App Router.
- Create Server Action to save a lead.
- Provide `supabase_schema.sql` for the UI team.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Supabase Client & Server Action | Install @supabase/supabase-js, set up client in `lib/`, create Server Action `saveLead` | M1 | DONE |
| 2 | DB Schema Documentation | Create `supabase_schema.sql` at root | M1 | DONE |

## Interface Contracts
### Client ↔ Supabase (Server Action)
- `saveLead(email: string): Promise<{ success: boolean; error?: string }>`
