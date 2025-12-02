-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vc_company_id UUID REFERENCES public.vc_companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.post_categories(id) ON DELETE SET NULL,
    activity_urn TEXT UNIQUE NOT NULL,
    full_urn TEXT,
    post_url TEXT UNIQUE NOT NULL,
    text_content TEXT,
    posted_at TIMESTAMPTZ NOT NULL,
    post_language TEXT DEFAULT 'en',
    post_type TEXT DEFAULT 'regular',
    engagement_score NUMERIC(10, 2) DEFAULT 0,
    stats JSONB DEFAULT '{}'::jsonb,
    media JSONB DEFAULT '{}'::jsonb,
    document JSONB DEFAULT '{}'::jsonb,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_posts_vc_company_id ON public.posts(vc_company_id);
CREATE INDEX idx_posts_category_id ON public.posts(category_id);
CREATE INDEX idx_posts_posted_at ON public.posts(posted_at DESC);
CREATE INDEX idx_posts_engagement_score ON public.posts(engagement_score DESC);
CREATE INDEX idx_posts_activity_urn ON public.posts(activity_urn);

-- GIN index for JSONB searching
CREATE INDEX idx_posts_stats ON public.posts USING GIN (stats);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on posts" ON public.posts
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger for vc_companies table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vc_companies_updated_at
    BEFORE UPDATE ON public.vc_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
