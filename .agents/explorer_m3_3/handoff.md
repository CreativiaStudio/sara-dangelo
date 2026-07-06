# Handoff: Supabase Integration Strategy (Milestone 3)

## Observation
- The project is a Next.js App Router application (the `app` directory exists).
- Examining `package.json` reveals that `@supabase/supabase-js` is not yet installed.
- The `lib` directory is currently empty.
- According to `.agents/sub_orch_m3/SCOPE.md`, the requirements are:
  1. Install `@supabase/supabase-js`.
  2. Set up the Supabase client in the `lib/` directory.
  3. Create a Server Action named `saveLead` matching the signature `saveLead(email: string): Promise<{ success: boolean; error?: string }>`.
  4. Create a `supabase_schema.sql` file at the project root for UI/DB teams.

## Logic Chain
1. **Dependency Addition**: Since we only need the basic client for a Server Action (which doesn't explicitly require complex cookie-based auth handling for a simple lead capture), we will install `@supabase/supabase-js` as requested.
2. **Supabase Client (`lib/supabase.ts`)**: We need a central location to initialize the Supabase client using standard environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. **Server Action (`app/actions.ts`)**: We will create an `app/actions.ts` file containing the `saveLead` function. It must use the `"use server"` directive at the top of the function or file to ensure it runs exclusively on the server. It will utilize the client from `lib/supabase.ts` to insert the email into the database.
4. **Database Schema (`supabase_schema.sql`)**: We need a table to store the leads. A table named `leads` with `id`, `email`, and `created_at` fields is standard. To ensure security, Row Level Security (RLS) should be enabled, allowing anonymous `INSERT` operations but blocking `SELECT`, `UPDATE`, or `DELETE` from unauthenticated users.

## Caveats
- **Environment Variables**: The implementation depends on `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These must be added to a `.env.local` file (and production environments) by the implementation team.
- **Error Handling**: The `error` string returned by `saveLead` might contain database-specific error messages if not carefully sanitized. For duplicate emails, a generic "This email is already registered." error should be returned.

## Conclusion

We recommend the following implementation steps and code structures:

### 1. Install Dependency
Run the following command:
```bash
npm install @supabase/supabase-js
```

### 2. Create Client (`lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Create Server Action (`app/actions.ts`)
```typescript
"use server";

import { supabase } from '@/lib/supabase';

export async function saveLead(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, error: "Invalid email address provided." };
  }

  const { error } = await supabase
    .from('leads')
    .insert([{ email }]);

  if (error) {
    // Handle unique constraint violation (code 23505 in Postgres)
    if (error.code === '23505') {
      return { success: false, error: "This email is already registered." };
    }
    console.error("Supabase insert error:", error);
    return { success: false, error: "Failed to save lead. Please try again later." };
  }

  return { success: true };
}
```

### 4. Create Database Schema (`supabase_schema.sql` at root)
```sql
-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts so users can submit their email without logging in
CREATE POLICY "Allow anonymous inserts" ON public.leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- (Optional) Only authenticated users/admins can view the leads
CREATE POLICY "Allow authenticated read" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);
```

## Verification Method
1. **Dependency Check**: After running `npm install`, verify `@supabase/supabase-js` is in `package.json`.
2. **Type Checking & Build**: Run `npm run build` to ensure the Next.js compiler is happy with the server action and the Supabase client types.
3. **Database Setup**: Execute `supabase_schema.sql` in the Supabase SQL Editor and ensure no syntax errors are thrown.
4. **Action Testing**: Write a Playwright test or temporary UI form to trigger `saveLead("test@example.com")` and verify that the `{ success: true }` response is received and the database shows the inserted row.
