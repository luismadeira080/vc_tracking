import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { categorizePost, getCategoryIdBySlug } from '@/lib/utils/postCategorizer';
import { calculateEngagementScore } from '@/lib/utils/engagementCalculator';
import { slugify } from '@/lib/utils/slugify';
import type { LinkedInPostRaw, PostStats } from '@/types';

/**
 * Webhook endpoint to receive LinkedIn post data from n8n
 *
 * Expected payload:
 * {
 *   posts: LinkedInPostRaw[]  // Array of LinkedIn posts from Apify scraper
 * }
 *
 * Authentication: Bearer token in Authorization header
 */
export async function POST(request: NextRequest) {
  try {
    // Log incoming request for debugging
    console.log('🔔 Webhook received request');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));

    // Verify webhook secret
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.log('❌ Auth failed:', authHeader);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Authentication passed');

    // Parse request body
    const body = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));

    const { posts } = body as { posts: LinkedInPostRaw[] };

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'No posts provided' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get all categories for categorization
    const { data: categories, error: categoriesError } = await supabase
      .from('post_categories')
      .select('*');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Process each post
    for (const post of posts) {
      try {
        // Extract company name from source_company or author
        const companyName = post.source_company || post.author.name;
        const companySlug = slugify(companyName);

        // Check if company exists, if not create it
        let { data: company, error: companyLookupError } = await supabase
          .from('vc_companies')
          .select('id')
          .eq('slug', companySlug)
          .single();

        if (companyLookupError && companyLookupError.code !== 'PGRST116') {
          // PGRST116 is "not found" error
          throw companyLookupError;
        }

        if (!company) {
          // Create new company
          const { data: newCompany, error: createError } = await supabase
            .from('vc_companies')
            .insert({
              name: companyName,
              slug: companySlug,
              linkedin_url: post.author.company_url || '',
              logo_url: post.author.logo_url || null,
              follower_count: post.author.follower_count || 0,
              is_tracked: true,
            })
            .select('id')
            .single();

          if (createError) throw createError;
          company = newCompany;
        } else {
          // Update existing company with fresh data from LinkedIn
          const { error: updateError } = await supabase
            .from('vc_companies')
            .update({
              logo_url: post.author.logo_url || null,
              follower_count: post.author.follower_count || 0,
              linkedin_url: post.author.company_url || '',
              updated_at: new Date().toISOString(),
            })
            .eq('id', company.id);

          if (updateError) console.error('Failed to update company:', updateError);
        }

        // Check if post already exists
        const { data: existingPost } = await supabase
          .from('posts')
          .select('id')
          .eq('activity_urn', post.activity_urn)
          .single();

        if (existingPost) {
          results.skipped++;
          continue;
        }

        // Categorize post
        const categorySlug = categorizePost(
          post.text || '',
          categories.map((c) => ({ slug: c.slug, keywords: c.keywords }))
        );
        const categoryId = getCategoryIdBySlug(categorySlug, categories);

        // Convert stats format
        const stats: PostStats = {
          total_reactions: post.stats.total_reactions || 0,
          like: post.stats.like || 0,
          love: post.stats.love || 0,
          celebrate: post.stats.celebrate || 0,
          comments: post.stats.comments || 0,
          reposts: post.stats.reposts || 0,
        };

        // Calculate engagement score
        const engagementScore = calculateEngagementScore(stats);

        // Insert post
        const { error: insertError } = await supabase.from('posts').insert({
          vc_company_id: company.id,
          category_id: categoryId,
          activity_urn: post.activity_urn,
          full_urn: post.full_urn || null,
          post_url: post.post_url,
          text_content: post.text || null,
          posted_at: new Date(post.posted_at.timestamp).toISOString(),
          post_language: post.post_language_code || 'en',
          post_type: post.post_type || 'text',
          engagement_score: engagementScore,
          stats: stats,
          media: post.media || {},
          document: post.document || null,
          raw_data: post,
        });

        if (insertError) throw insertError;

        results.success++;
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Post ${post.activity_urn}: ${errorMessage}`);
        console.error(`Failed to process post ${post.activity_urn}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Webhook processed',
      results,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is active',
  });
}
