# Supabase Implementation Strategy

**Objective**: Strategy for implementing Supabase client, Server Action for leads, and `supabase_schema.sql`.

## 1. Observation
- `package.json` does not currently contain `@supabase/supabase-js` or any Supabase dependencies.
- The project structure uses the Next.js App Router (`app/`), but there is no `actions` folder yet.
- A `lib/` folder exists at the project root.
- The `.agents/sub_orch_m3/SCOPE.md` requires:
  1. Setup Supabase client in `lib/`.
  2. Create a Server Action `saveLead(email: string)`.
  3. Create `supabase_schema.sql` at the root.

## 2. Logic Chain
1. **Dependency**: We need `@supabase/supabase-js` to create the client.
2. **Client Setup**: Since the `lib/` directory exists, `lib/supabase.ts` is the best location for the Supabase initialization. We can use the standard `createClient` using environment variables.
3. **Server Action**: To support `saveLead`, we need a Server Action. Creating `app/actions/saveLead.ts` follows Next.js App Router conventions.
4. **Database Schema**: A SQL script named `supabase_schema.sql` should be placed at the project root to define the `leads` table, enable Row Level Security (RLS), and add policies to allow anonymous inserts so leads can be submitted without authentication.

## 3. Caveats
- I did not add `@supabase/ssr`. Since the requirement only specifies `@supabase/supabase-js` and the action is simply inserting data without needing to manage user sessions/cookies in the Next.js app, the standard client is sufficient.
- The implementation relies on `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` being set in a `.env.local` file.
- The `saveLead` Server Action assumes `email` is validated on the client. Further server-side validation (e.g. using `zod`) is recommended but not strictly part of the interface contract.

## 4. Conclusion
**Step 1: Install Dependencies**
```bash
npm install @supabase/supabase-js
```

**Step 2: Create `lib/supabase.ts`**
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 3: Create `app/actions/saveLead.ts`**
```ts
'use server'

import { supabase } from '@/lib/supabase';

export async function saveLead(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert([{ email }]);
      
    if (error) {
      console.error('Error saving lead:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error saving lead:', err);
    return { success: false, error: 'Internal server error' };
  }
}
```

**Step 4: Create `supabase_schema.sql` at the project root**
```sql
-- Create leads table
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so anyone can submit their email)
CREATE POLICY "Allow anonymous inserts" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Only authenticated users (e.g. admins) can view leads
CREATE POLICY "Allow authenticated read" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);
```

**Step 5: Setup Environment Variables**
Ensure `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Verification Method
1. Run `npm run lint` and `npm run build` after implementing to ensure TypeScript compiler passes.
2. Manually test the `saveLead` function from a UI component to confirm data appears in Supabase.
3. Apply `supabase_schema.sql` via the Supabase Dashboard SQL Editor to verify it executes without syntax errors.
