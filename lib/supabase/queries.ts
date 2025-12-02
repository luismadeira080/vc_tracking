import { createClient } from './server';
import type { Post, PostWithRelations, VCCompany, PostCategory } from '@/types';

/**
 * Get all tracked VC companies
 */
export async function getTrackedCompanies() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('vc_companies')
    .select('*')
    .eq('is_tracked', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as VCCompany[];
}

/**
 * Get posts from the last N days
 */
export async function getRecentPosts(days: number = 7, companyId?: string) {
  const supabase = createClient();
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  let query = supabase
    .from('posts')
    .select('*, vc_companies(*), post_categories(*)')
    .gte('posted_at', dateThreshold.toISOString())
    .order('posted_at', { ascending: false });

  if (companyId) {
    query = query.eq('vc_company_id', companyId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as PostWithRelations[];
}

/**
 * Get top performing posts by engagement score
 */
export async function getTopPosts(limit: number = 10, days?: number) {
  const supabase = createClient();

  let query = supabase
    .from('posts')
    .select('*, vc_companies(*), post_categories(*)')
    .order('engagement_score', { ascending: false })
    .limit(limit);

  if (days) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    query = query.gte('posted_at', dateThreshold.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as PostWithRelations[];
}

/**
 * Get all posts for a specific VC company
 */
export async function getCompanyPosts(companySlug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*, vc_companies!inner(*), post_categories(*)')
    .eq('vc_companies.slug', companySlug)
    .order('posted_at', { ascending: false });

  if (error) throw error;
  return data as PostWithRelations[];
}

/**
 * Get VC company by slug
 */
export async function getCompanyBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('vc_companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as VCCompany;
}

/**
 * Get all post categories
 */
export async function getCategories() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as PostCategory[];
}
