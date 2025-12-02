-- Create post_categories lookup table
CREATE TABLE IF NOT EXISTS public.post_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    color TEXT DEFAULT '#6B7280',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX idx_post_categories_slug ON public.post_categories(slug);

-- Enable Row Level Security
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on post_categories" ON public.post_categories
    FOR ALL
    USING (true)
    WITH CHECK (true);
