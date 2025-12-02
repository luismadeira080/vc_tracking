-- Seed post categories with keywords for auto-categorization
INSERT INTO public.post_categories (name, slug, keywords, color) VALUES
    ('Events', 'events', ARRAY['event', 'conference', 'webinar', 'meetup', 'summit', 'workshop'], '#3B82F6'),
    ('Portfolio', 'portfolio', ARRAY['portfolio', 'investment', 'funding', 'raise', 'announcing', 'proud to share'], '#10B981'),
    ('Founders', 'founders', ARRAY['founder', 'team', 'meet', 'welcome', 'joined', 'hire'], '#8B5CF6'),
    ('Thought Leadership', 'thought-leadership', ARRAY['trend', 'insight', 'future', 'perspective', 'analysis', 'opinion'], '#F59E0B'),
    ('Hiring', 'hiring', ARRAY['hiring', 'job', 'career', 'opportunity', 'join us', 'we are looking'], '#EF4444'),
    ('Other', 'other', ARRAY[]::TEXT[], '#6B7280')
ON CONFLICT (slug) DO NOTHING;
