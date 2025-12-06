# Architecture Documentation

## System Overview

The VC LinkedIn Intelligence Platform is a Next.js application that monitors and analyzes LinkedIn content from competitor VC firms. This document describes the system architecture, data flow, and component organization.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: PostgreSQL via Supabase
- **Automation**: n8n + Apify
- **Date Utilities**: date-fns

## Data Flow

```
┌─────────┐      ┌─────────┐      ┌──────────────┐      ┌────────────┐      ┌──────────┐
│ LinkedIn│ ───> │  Apify  │ ───> │     n8n      │ ───> │  Next.js   │ ───> │ Supabase │
│  Pages  │      │ Scraper │      │  Automation  │      │  Webhook   │      │PostgreSQL│
└─────────┘      └─────────┘      └──────────────┘      └────────────┘      └──────────┘
     │                                     │                     │                  │
     │                                     │                     │                  │
  Scrapes                            Sends raw           Categorizes          Stores
VC Company                            JSON to            Calculates           Posts &
   Posts                             webhook              scores            Companies
```

### Detailed Flow

1. **Apify Scraper**
   - Runs on a schedule (e.g., daily)
   - Scrapes LinkedIn company pages for tracked VC firms
   - Extracts posts with full metadata (author, stats, media, etc.)
   - Sends raw JSON data to n8n webhook

2. **n8n Automation**
   - Receives JSON from Apify webhook
   - Sends raw data to Next.js webhook endpoint (no transformation)

3. **Next.js Webhook API** (`/api/webhook`)
   - Receives raw LinkedIn post data from n8n
   - Auto-categorizes posts using keyword matching
   - Calculates engagement scores with weighted formula
   - Upserts VC companies (creates if new)
   - Stores posts in Supabase
   - Skips duplicates (idempotent)

4. **Supabase (PostgreSQL)**
   - Stores VC companies, posts, and categories
   - Full raw JSON stored in `raw_data` JSONB column
   - Indexes optimized for common queries
   - Row Level Security (RLS) enabled

5. **Next.js Application**
   - Server Components fetch data directly from Supabase
   - Client Components for interactive filters and charts
   - Real-time updates via Supabase subscriptions (future)

## Database Schema

See `docs/schema.md` for detailed table structures.

### Key Tables

- **`vc_companies`**: Tracked VC firms (name, slug, LinkedIn URL, logo, follower count)
- **`post_categories`**: Categorization lookup table (Events, Portfolio, Founders, etc.)
- **`posts`**: LinkedIn posts with engagement metrics, JSONB raw data

## Application Structure

### Directory Layout

```
app/
├── layout.tsx                    # Root layout (global styles, fonts)
├── page.tsx                      # Landing page → redirects to /dashboard
├── dashboard/
│   ├── layout.tsx                # Dashboard shell with sidebar
│   ├── page.tsx                  # Weekly overview feed
│   ├── companies/[slug]/
│   │   └── page.tsx              # Individual VC company details
│   └── insights/
│       └── page.tsx              # Performance insights & analytics
└── api/
    ├── webhook/
    │   └── route.ts              # POST endpoint for n8n
    └── posts/
        └── categorize/
            └── route.ts          # Manual re-categorization
```

### Component Architecture

#### Server Components (Default)

- Fetch data directly from Supabase
- No client-side JavaScript overhead
- SEO-friendly, fast initial load
- Used for: layouts, feeds, post cards, company profiles

#### Client Components

- Prefixed with `'use client'`
- Interactive elements requiring state
- Used for: filters, charts, interactive tables, modals

### Key Components

```
components/
├── dashboard/
│   ├── Sidebar.tsx               # Navigation with VC company list
│   └── (Future components)
└── ui/
    ├── Button.tsx                # Reusable button component
    ├── Card.tsx                  # Card container
    ├── Badge.tsx                 # Badge component
    └── Select.tsx                # Dropdown select
```

### Post Card Design Specification (CRITICAL - DO NOT MODIFY)

**Applies to:** All pages displaying LinkedIn posts
- `/dashboard` (main feed)
- `/dashboard/insights` (top performers)
- `/dashboard/companies/[slug]` (company-specific posts)

**Standard Post Card Structure:**

```tsx
<article className="bg-white dark:bg-zinc-900 rounded-lg border p-6">
  {/* 1. Engagement Metrics Grid - ALWAYS AT TOP */}
  <div className="grid grid-cols-4 gap-3 mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
    <div>
      <div className="text-2xl font-bold">{post.engagement_score}</div>
      <div className="text-xs text-zinc-500">TOTAL ENG.</div>
    </div>
    <div>
      <div className="text-2xl font-bold">{post.stats.total_reactions}</div>
      <div className="text-xs text-zinc-500">LIKES</div>
    </div>
    <div>
      <div className="text-2xl font-bold">{post.stats.comments}</div>
      <div className="text-xs text-zinc-500">COMMENTS</div>
    </div>
    <div>
      <div className="text-2xl font-bold">{post.stats.reposts}</div>
      <div className="text-xs text-zinc-500">REPOSTS</div>
    </div>
  </div>

  {/* 2. Company Info + Metadata */}
  <div className="flex items-center gap-3 mb-4">
    {/* Company logo (w-12 h-12 rounded-full) */}
    {/* Company name, date, category badge */}
  </div>

  {/* 3. Media Preview - FULL IMAGE VISIBLE */}
  {/* Key attributes:
      - Wrapper: bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4
      - Image: object-contain (NOT object-cover)
      - Max height: max-h-[600px] for single images
      - Margins on sides (gray background visible)
  */}
  {post.document?.thumbnail && (
    <div className="mb-4 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
      <img
        src={post.document.thumbnail}
        className="max-w-full h-auto max-h-[600px] object-contain rounded-lg"
      />
    </div>
  )}

  {/* 4. Post Text Content */}
  <p className="text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-4 leading-relaxed">
    {post.text_content}
  </p>

  {/* 5. View on LinkedIn Link */}
</article>
```

**Design Principles:**
1. **Metrics First**: Engagement numbers prominently displayed at top
2. **Full Image Visibility**: Use `object-contain` to show entire image (top to bottom)
3. **Margins on Images**: Gray background (`bg-zinc-100`) with padding creates margins
4. **No Cropping**: Images scale to fit, never crop
5. **Consistent Spacing**: Use mb-4 for section spacing
6. **NO duplicate stats**: Remove bottom engagement stats (already at top)

## API Layer

### Supabase Clients

**Server-Side** (`lib/supabase/server.ts`)
- Uses cookies for session management
- Used in Server Components and Server Actions
- Direct database access

**Client-Side** (`lib/supabase/client.ts`)
- Browser-based client
- Used in Client Components
- Same database access via Supabase API

### Query Layer (`lib/supabase/queries.ts`)

Centralized query functions:

```typescript
// Example
export async function getWeeklyPosts(companyId?: string) {
  const supabase = createServerClient();
  const weekAgo = subDays(new Date(), 7);

  let query = supabase
    .from('posts')
    .select('*, vc_companies(*), post_categories(*)')
    .gte('posted_at', weekAgo.toISOString())
    .order('posted_at', { ascending: false });

  if (companyId) {
    query = query.eq('vc_company_id', companyId);
  }

  return query;
}
```

## Authentication (Future)

Currently, the app has no authentication (open access).

For production:
1. Enable Supabase Auth
2. Add login page
3. Update RLS policies to restrict by user
4. Add role-based access (admin vs viewer)

## Performance Optimizations

### Database Indexes

- B-tree indexes on foreign keys (`vc_company_id`, `category_id`)
- Descending index on `posted_at` (most recent first)
- Descending index on `engagement_score` (top performers)
- GIN index on `stats` JSONB column (flexible queries)

### Next.js Optimizations

- Server Components by default (reduce client JS)
- Dynamic imports for heavy components
- Image optimization via `next/image`
- Font optimization via `next/font`
- Route caching (App Router)

### Caching Strategy

- **Server Components**: Cached by Next.js
- **API Routes**: No caching (fresh data)
- **Static Assets**: CDN caching
- **Database Queries**: Indexed for speed

## Business Logic

### Post Categorization

**Location**: `lib/utils/postCategorizer.ts`

**Logic**:
1. Load category keywords from database
2. Convert post text to lowercase
3. Check if any keyword matches
4. Return first matching category, else "Other"

**Example**:
- Post contains "webinar" → Categorized as "Events"
- Post contains "portfolio company" → Categorized as "Portfolio"

### Engagement Scoring

**Location**: `lib/utils/engagementCalculator.ts`

**Formula**:
```
engagement_score = total_reactions + (comments × 2) + (reposts × 3)
```

**Rationale**:
- Reactions are low-effort (single click)
- Comments show deeper engagement (weighted 2×)
- Reposts show highest endorsement (weighted 3×)

## Deployment

### Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_CONNECTION_STRING` (for MCP server)
- `WEBHOOK_SECRET` (for n8n webhook verification)

### Hosting Options

**Vercel** (Recommended):
- Native Next.js support
- Automatic deployments from git
- Edge functions for API routes

**Alternatives**:
- Netlify
- AWS Amplify
- Self-hosted (Docker + Node.js)

## Monitoring & Observability

### Error Handling

- API routes return structured error responses
- Database errors logged to console (dev) or service (prod)
- n8n webhook logs all ingestion attempts

### Analytics (Future)

- Track page views (Vercel Analytics)
- Monitor API endpoint usage
- Track engagement score trends over time

## Security Considerations

### Current State

- No authentication (development only)
- RLS policies allow all operations
- Webhook endpoint has no authentication

### Production Requirements

1. **Authentication**: Supabase Auth or OAuth
2. **Webhook Security**: Validate `WEBHOOK_SECRET` header
3. **RLS Policies**: Restrict database access by user role
4. **Input Validation**: Sanitize all inputs from n8n
5. **Rate Limiting**: Prevent abuse of webhook endpoint

## Future Enhancements

1. **Real-time Updates**: Supabase subscriptions for live post feed
2. **AI Insights**: LLM analysis of post content
3. **Alerts**: Notify when competitor posts go viral
4. **Export**: CSV/PDF reports for clients
5. **Multi-tenancy**: Support multiple client accounts

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase Server-Side Rendering](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Recharts Documentation](https://recharts.org/)
