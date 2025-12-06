# VC LinkedIn Intelligence Platform

A Next.js application for monitoring and analyzing LinkedIn content from Portuguese venture capital firms.

## 🎯 Project Status: **PRODUCTION READY** ✅

**Live URL**: https://vc-tracking.vercel.app

### ✅ Completed (Phase 1-3)
- ✅ Database schema with 3 tables (vc_companies, post_categories, posts)
- ✅ Next.js dashboard with weekly feed, company pages, and insights
- ✅ Webhook API endpoint receiving LinkedIn data from n8n
- ✅ Deployed to Vercel with all environment variables configured
- ✅ Security patches applied (Next.js 16.0.7, React 19.2.1)
- ✅ Company logos displaying correctly (author.name extraction)
- ✅ Document thumbnails rendering (post.document.thumbnail support)
- ✅ Professional post card design with prominent engagement metrics
- ✅ Full image visibility with object-contain (no cropping)
- ✅ Consistent UI across all dashboard pages

### 🎨 Design System
- **Post Cards**: Standardized layout with engagement metrics at top
- **Image Display**: Full visibility with margins (object-contain)
- **Typography**: 2xl bold numbers for metrics, consistent spacing
- **Dark Mode**: Full support with Tailwind dark: variants

### 📋 Next Steps (Phase 4)
1. Migrate to new 4-category system (Founders, New Investments, Events, Portfolio News)
2. Add Recharts visualizations (category performance, engagement timeline)
3. Build master-detail view for post inspection
4. Add company-specific analytics dashboards

---

## Overview

This platform helps venture capital firms track competitor content strategies on LinkedIn by:
- Automatically scraping LinkedIn posts from tracked VC companies
- Categorizing posts (Events, Portfolio, Founders, Thought Leadership, Hiring)
- Calculating engagement scores
- Providing weekly dashboards and insights
- Enabling competitive benchmarking

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL)
- **Automation**: n8n + Apify
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Deployment**: Vercel

## Project Structure

```
micro-saas/
├── supabase/
│   └── migrations/         # Database schema migrations (4 files)
├── app/
│   ├── dashboard/          # Dashboard pages (main, companies, insights)
│   └── api/webhook/        # Webhook endpoint for n8n
├── components/
│   ├── dashboard/          # Dashboard-specific components (Sidebar)
│   └── ui/                 # Reusable UI components (Button, Card, Badge, Select)
├── lib/
│   ├── supabase/           # Supabase clients and queries
│   └── utils/              # Utility functions (categorizer, calculator, etc.)
├── types/                  # TypeScript type definitions
├── docs/                   # Documentation (7 files)
│   ├── quick-start.md      # 30-minute setup guide ⭐ START HERE
│   ├── architecture.md     # System architecture
│   ├── schema.md           # Database schema details
│   ├── project_goals.md    # Business logic and goals
│   ├── n8n-setup-guide.md  # Complete n8n guide
│   ├── n8n-workflow-explained.md  # How workflow loops work
│   ├── portuguese-vc-list.md      # 13 tracked companies
│   └── webhook-setup.md    # API reference
├── workflows/              # n8n workflow JSON files
└── data/                   # Data directory (gitignored)
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- Vercel account (for deployment)
- n8n account (free tier) or self-hosted
- Apify account (free trial)

### 2. Clone & Install

```bash
cd micro-saas
npm install
```

### 3. Environment Variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Add your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://exonxmdewywsqlwmrewb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
WEBHOOK_SECRET=5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Production

See `docs/quick-start.md` for complete deployment guide.

**Vercel Setup:**
1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `WEBHOOK_SECRET`
3. Deploy automatically on push to `main`

## Documentation

**Start here:** [`docs/quick-start.md`](docs/quick-start.md) - Complete 30-minute setup guide

All documentation is in the `docs/` directory:

- **[architecture.md](docs/architecture.md)**: System architecture and data flow
- **[schema.md](docs/schema.md)**: Database schema specifications
- **[project_goals.md](docs/project_goals.md)**: Business logic and feature requirements
- **[n8n-setup-guide.md](docs/n8n-setup-guide.md)**: Complete n8n workflow setup
- **[n8n-workflow-explained.md](docs/n8n-workflow-explained.md)**: How the loop workflow works
- **[portuguese-vc-list.md](docs/portuguese-vc-list.md)**: All 13 tracked Portuguese VCs
- **[webhook-setup.md](docs/webhook-setup.md)**: Webhook API reference

## Key Features

### ✅ Phase 1: Foundation (COMPLETE)

- ✅ Database schema with 3 tables
- ✅ TypeScript types matching LinkedIn JSON structure
- ✅ Supabase SSR clients (server & browser)
- ✅ Utility functions (categorizer, engagement calculator)
- ✅ Comprehensive documentation
- ✅ Context preservation system (`.cursorrules`)

### ✅ Phase 2: Dashboard (COMPLETE)

- ✅ Landing page redirecting to dashboard
- ✅ Dashboard layout with sidebar navigation
- ✅ Weekly posts feed with media preview
- ✅ Individual VC company pages
- ✅ Performance insights page
- ✅ Filtering and sorting

### ✅ Phase 3: Deployment (COMPLETE)

- ✅ Webhook endpoint for n8n (`/api/webhook`)
- ✅ Deployed to Vercel (https://vc-tracking.vercel.app)
- ✅ Environment variables configured
- ✅ TypeScript build passing
- ✅ Production-ready

### 🔄 Phase 4: Automation (IN PROGRESS)

- ✅ n8n workflow structure created
- ✅ Google Sheets integration for company list
- ✅ Apify scraper nodes configured
- 🔄 Webhook node JSON body finalization
- ⏳ Apify account setup
- ⏳ First test run with Portuguese VCs

### 📋 Phase 5: Future Enhancements

- [ ] Real-time updates via Supabase subscriptions
- [ ] AI-powered insights (GPT-4 summarization)
- [ ] Email alerts for viral posts
- [ ] Export reports (PDF/CSV)
- [ ] Multi-tenancy support

## Tracked Companies

**13 Portuguese VC Firms:**
1. Indico Capital Partners
2. Crest Capital Partners
3. Oxy Capital
4. BlueCrow
5. Shilling VC
6. Portugal Ventures
7. Armilar Venture Partners
8. Bynd Venture Capital
9. Iberis Capital
10. Lince Capital
11. Explorer Investments
12. Draycott
13. Faber

**Expected volume:** ~40-50 posts per week total (3-4 posts/week per VC)

## Database Schema

### vc_companies

Tracks VC firms to monitor.

**Columns**: `id`, `name`, `slug`, `linkedin_url`, `logo_url`, `follower_count`, `is_tracked`, `created_at`, `updated_at`

### post_categories

Lookup table for post categorization.

**Categories**: Events, Portfolio, Founders, Thought Leadership, Hiring, Other

### posts

LinkedIn posts with full metadata.

**Columns**: `id`, `vc_company_id`, `category_id`, `activity_urn`, `post_url`, `text_content`, `posted_at`, `engagement_score`, `stats` (JSONB), `media` (JSONB), `raw_data` (JSONB), and more.

See [`docs/schema.md`](docs/schema.md) for full details.

## Business Logic

### Post Categorization

Posts are auto-categorized using keyword matching:

- **Events**: "conference", "webinar", "summit", etc.
- **Portfolio**: "investment", "funding", "raise", etc.
- **Founders**: "founder", "team", "welcome", etc.
- **Thought Leadership**: "insight", "trend", "perspective", etc.
- **Hiring**: "job", "career", "opportunity", etc.

**File**: `lib/utils/postCategorizer.ts`

### Engagement Scoring

**Formula**: `total_reactions + (comments × 2) + (reposts × 3)`

Weighted to prioritize deeper engagement (comments, reposts).

**File**: `lib/utils/engagementCalculator.ts`

## API Endpoints

### Webhook Endpoint

**URL**: `https://vc-tracking.vercel.app/api/webhook`

**Method**: `POST`

**Authentication**: Bearer token

**Expected Payload**:
```json
{
  "posts": [
    {
      "activity_urn": "urn:li:activity:...",
      "post_url": "https://linkedin.com/...",
      "text": "Post content",
      "posted_at": { "timestamp": 1733011200000 },
      "author": { "name": "Company Name", ... },
      "stats": { "total_reactions": 100, "comments": 5, "reposts": 2 },
      ...
    }
  ]
}
```

See [`docs/webhook-setup.md`](docs/webhook-setup.md) for complete API reference.

## Development

### Code Style

- **TypeScript**: Strict mode, no `any` types
- **Components**: Server Components by default
- **Styling**: Tailwind CSS utility classes only
- **Icons**: Lucide React
- **Dates**: date-fns for formatting

See [`.cursorrules`](.cursorrules) for complete style guide.

### Before Making Changes

Always read the relevant documentation first:

- Database changes? Read `docs/schema.md`
- Data flow changes? Read `docs/architecture.md`
- Feature changes? Read `docs/project_goals.md`

### Testing Locally

```bash
# Run dev server
npm run dev

# Test webhook health
curl http://localhost:3000/api/webhook

# Test with sample data
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d" \
  -d @test-webhook.json
```

## Deployment

### Current Deployment

**Platform**: Vercel
**URL**: https://vc-tracking.vercel.app
**Branch**: `main` (auto-deploy enabled)

### Environment Variables (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://exonxmdewywsqlwmrewb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
WEBHOOK_SECRET=5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d
```

**Note**: Set for all environments (Production, Preview, Development)

### Cost Estimate

**Development/Testing**: Free
- Supabase: Free tier
- Vercel: Free tier
- n8n: Free tier (5,000 executions/month)
- Apify: $5 free credit

**Production**: ~$5-8/month
- Supabase: Free tier (sufficient)
- Vercel: Free tier
- n8n: Free tier (30 daily runs within limit)
- Apify: ~$5-8/month (daily scraping)

## Contributing

1. Read `.cursorrules` for coding standards
2. Follow commit message format: `type(scope): message`
3. Test locally before committing
4. Update documentation if needed

## Git Workflow

**Main Branch**: `main` (production-ready)

**Commit Message Format**:
```
type(scope): message

Examples:
- feat(dashboard): add weekly posts feed
- fix(api): correct engagement score calculation
- docs(schema): update posts table description
```

## Troubleshooting

### Common Issues

**Issue**: Webhook returns 401 Unauthorized
**Solution**: Verify Bearer token matches `WEBHOOK_SECRET` in `.env.local`

**Issue**: No posts appearing in dashboard
**Solution**: Check posts are recent (dashboard shows last 7 days only)

**Issue**: Build fails on Vercel
**Solution**: Ensure all environment variables are set in Vercel dashboard

See `docs/quick-start.md` for more troubleshooting.

## License

Proprietary - Client Project

## Contact

For questions or support, contact the development team.

---

**Built with ❤️ using Next.js, Supabase, n8n, Apify, and Claude Code**

**Last Updated**: December 5, 2025
