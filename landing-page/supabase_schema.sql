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
