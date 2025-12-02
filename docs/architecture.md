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
│ LinkedIn│ ───> │  Apify  │ ───> │     n8n      │ ───> │  Supabase  │ ───> │ Next.js  │
│  Pages  │      │ Scraper │      │  Automation  │      │ PostgreSQL │      │Dashboard │
└─────────┘      └─────────┘      └──────────────┘      └────────────┘      └──────────┘
     │                                     │                     │                  │
     │                                     │                     │                  │
  Scrapes                            Transforms             Stores           Displays
VC Company                           JSON data              Posts            Analytics
   Posts                         Calculates scores      & Companies         & Insights
```

### Detailed Flow

1. **Apify Scraper**
   - Runs on a schedule (e.g., daily)
   - Scrapes LinkedIn company pages for tracked VC firms
   - Extracts posts with full metadata (author, stats, media, etc.)
   - Sends raw JSON data to n8n webhook

2. **n8n Automation**
   - Receives JSON from Apify webhook
   - Transforms data structure
   - Calculates engagement scores
   - Auto-categorizes posts using keyword matching
   - Upserts VC company (if new)
   - Inserts post into Supabase via webhook endpoint

3. **Supabase (PostgreSQL)**
   - Stores VC companies, posts, and categories
   - Full raw JSON stored in `raw_data` JSONB column
   - Indexes optimized for common queries
   - Row Level Security (RLS) enabled

4. **Next.js Application**
   - Server Components fetch data directly from Supabase
   - API routes handle webhook ingestion from n8n
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
│   ├── DashboardHeader.tsx       # Top bar with filters (date range, category)
│   ├── WeeklyPostsFeed.tsx       # Feed of posts (last 7 days)
│   ├── PerformanceInsights.tsx   # Metrics cards (top posts, active companies)
│   ├── PostCard.tsx              # Individual post display
│   ├── CategoryBadge.tsx         # Colored badge for post category
│   └── EngagementChart.tsx       # Recharts visualization
└── ui/
    ├── Button.tsx                # Reusable button component
    ├── Card.tsx                  # Card container
    ├── Badge.tsx                 # Badge component
    └── Select.tsx                # Dropdown select
```

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
