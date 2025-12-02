// TypeScript interfaces matching JSON structure and database schema

// ============================================================================
// Database Models
// ============================================================================

export interface VCCompany {
  id: string;
  name: string;
  slug: string;
  linkedin_url: string;
  logo_url: string | null;
  follower_count: number;
  is_tracked: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  keywords: string[];
  color: string;
  created_at: string;
}

export interface Post {
  id: string;
  vc_company_id: string;
  category_id: string | null;
  activity_urn: string;
  full_urn: string | null;
  post_url: string;
  text_content: string | null;
  posted_at: string;
  post_language: string;
  post_type: string;
  engagement_score: number;
  stats: PostStats;
  media: Record<string, any>;
  document: PostDocument | null;
  raw_data: LinkedInPostRaw;
  created_at: string;
}

// ============================================================================
// Sub-structures for Post
// ============================================================================

export interface PostStats {
  total_reactions: number;
  like: number;
  love: number;
  celebrate: number;
  comments: number;
  reposts: number;
}

export interface PostDocument {
  title: string;
  page_count: number;
  url: string;
  thumbnail: string;
}

// ============================================================================
// LinkedIn Raw Data (from Apify scraper)
// ============================================================================

export interface LinkedInPostRaw {
  activity_urn: string;
  full_urn: string;
  post_url: string;
  text: string;
  posted_at: {
    relative: string;
    is_edited: boolean;
    date: string;
    timestamp: number;
  };
  post_language_code: string;
  post_type: string;
  author: {
    name: string;
    follower_count: number;
    company_url: string;
    logo_url: string;
  };
  stats: PostStats;
  media: Record<string, any>;
  document?: PostDocument;
  source_company: string;
}

// ============================================================================
// Extended Types (with joins)
// ============================================================================

export interface PostWithCompany extends Post {
  company: VCCompany;
  category?: PostCategory;
}

export interface PostWithRelations extends Post {
  vc_companies: VCCompany;
  post_categories?: PostCategory;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface WebhookPayload {
  company: {
    name: string;
    linkedin_url: string;
    logo_url: string | null;
    follower_count: number;
  };
  post: {
    activity_urn: string;
    full_urn?: string;
    post_url: string;
    text: string;
    posted_at: string; // ISO 8601 timestamp
    post_language?: string;
    post_type?: string;
    stats: PostStats;
    media?: Record<string, any>;
    document?: PostDocument;
    category_slug?: string; // Pre-calculated category
    engagement_score: number; // Pre-calculated score
    raw_data: LinkedInPostRaw;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// UI Component Props
// ============================================================================

export interface FilterOptions {
  companyId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'posted_at' | 'engagement_score';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

// ============================================================================
// Analytics & Insights
// ============================================================================

export interface EngagementTrend {
  date: string;
  avgEngagement: number;
  postCount: number;
}

export interface CategoryDistribution {
  categoryName: string;
  categorySlug: string;
  postCount: number;
  percentage: number;
  avgEngagement: number;
}

export interface TopPerformer {
  post: PostWithCompany;
  rank: number;
}

export interface CompanyActivity {
  company: VCCompany;
  postCount: number;
  totalEngagement: number;
  avgEngagement: number;
  topCategory: string;
}
