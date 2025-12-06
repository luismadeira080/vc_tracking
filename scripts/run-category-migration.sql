-- Phase 4: Update to new 4-category system
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/exonxmdewywsqlwmrewb/sql

-- STEP 1: Delete old categories
DELETE FROM public.post_categories;

-- STEP 2: Insert new 4-category system with updated keywords
INSERT INTO public.post_categories (name, slug, keywords, color) VALUES
    ('Founders', 'founders', ARRAY['meet the team', 'partner', 'advisor', 'team member', 'welcome', 'joined', 'meet our', 'new partner', 'leadership'], '#8B5CF6'),
    ('New Investments', 'new-investments', ARRAY['invested', 'backing', 'seed round', 'funding', 'announced investment', 'proud to back', 'series a', 'series b', 'raise', 'led by', 'portfolio company', 'investment'], '#10B981'),
    ('Events', 'events', ARRAY['summit', 'dinner', 'conference', 'slush', 'event', 'webinar', 'meetup', 'panel', 'workshop'], '#3B82F6'),
    ('Portfolio News', 'portfolio-news', ARRAY[]::TEXT[], '#F59E0B')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    keywords = EXCLUDED.keywords,
    color = EXCLUDED.color;

-- STEP 3: Verify the new categories
SELECT * FROM public.post_categories ORDER BY name;
