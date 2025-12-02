-- Create vc_companies table
CREATE TABLE IF NOT EXISTS public.vc_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    linkedin_url TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    follower_count INTEGER DEFAULT 0,
    is_tracked BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX idx_vc_companies_slug ON public.vc_companies(slug);

-- Create partial index for tracked companies
CREATE INDEX idx_vc_companies_is_tracked ON public.vc_companies(is_tracked) WHERE is_tracked = true;

-- Enable Row Level Security
ALTER TABLE public.vc_companies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on vc_companies" ON public.vc_companies
    FOR ALL
    USING (true)
    WITH CHECK (true);
