# Supabase Integration Strategy (Milestone 3)

## Observation
- **Dependencies**: `package.json` confirms Next.js 16.2.9 with React 19, but currently lacks any Supabase packages (`@supabase/supabase-js`).
- **Structure**: The project uses the Next.js App Router without a `src` directory. `app/` and `lib/` directories exist at the root, with `lib/` currently being empty.
- **Constraints**: `PROJECT.md` specifies the interface contract `saveLead(email: string): Promise<{ success: boolean; error?: string }>` to be used as a Server Action, and requires a Supabase setup with a `supabase_schema.sql` file provided for the DB schema documentation. `tsconfig.json` uses path aliases (`@/*` mapping to `./*`).

## Logic Chain
1. **Dependency Addition**: Since we only need a simple Server Action without complex Auth flow state sharing, adding `@supabase/supabase-js` is sufficient for the client connection.
2. **Client Setup**: A singleton Supabase client should be initialized in `lib/supabase.ts` using environment variables. This file acts as the primary data interface.
3. **Server Action**: The server action must be placed in a file marked with `'use server'`. A clean pattern is `app/actions/saveLead.ts`, which will invoke the Supabase client to insert the lead.
4. **Environment Variables**: The project needs `.env.local` to store `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. **Database Schema**: A schema file `supabase_schema.sql` at the root must define the `leads` table with an auto-generating UUID, unique email constraint, and timestamps.

## Caveats
- Because we use the standard Anon Key for inserts, Row Level Security (RLS) must be explicitly enabled on the Supabase `leads` table to allow anonymous inserts securely.
- If bypassing RLS is preferred for the Server Action, the `SUPABASE_SERVICE_ROLE_KEY` should be used instead of the Anon Key, but this requires care to never expose the key to the client. The proposed code assumes the standard `NEXT_PUBLIC_SUPABASE_ANON_KEY` approach with RLS.

## Conclusion

**1. Add Dependencies:**
```bash
npm install @supabase/supabase-js
```

**2. Environment Variables (`.env.local`):**
Create `.env.local` at the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**3. Supabase Client (`lib/supabase.ts`):**
Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**4. Server Action (`app/actions/saveLead.ts`):**
Create `app/actions/saveLead.ts`:
```typescript
'use server'

import { supabase } from '@/lib/supabase'

export async function saveLead(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert([{ email }])

    if (error) {
      console.error('Supabase error:', error)
      // Provide a user-friendly message for duplicate emails (Postgres Unique Violation)
      if (error.code === '23505') {
         return { success: false, error: 'Questa email è già registrata.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: 'Errore interno del server.' }
  }
}
```

**5. Database Schema (`supabase_schema.sql`):**
Create `supabase_schema.sql` at the root:
```sql
-- Create leads table
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to the leads table
CREATE POLICY "Allow anonymous inserts" ON public.leads
    FOR INSERT TO anon
    WITH CHECK (true);
```

## Verification Method
1. Run `npm run lint` and `npm run build` after adding these files to ensure the TypeScript types compile successfully.
2. Confirm the exact files exist: `lib/supabase.ts`, `app/actions/saveLead.ts`, `supabase_schema.sql`.
3. To test the logic, populate real variables in `.env.local`, and invoke `saveLead('test@example.com')` to verify it hits Supabase successfully without exposing security risks.
