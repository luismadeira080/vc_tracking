# VC LinkedIn Intelligence Platform

A Next.js application for monitoring and analyzing LinkedIn content from competitor VC firms.

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

## Project Structure

```
micro-saas/
├── .mcp/                   # Portable MCP server configuration
├── supabase/
│   └── migrations/         # Database schema migrations (4 files)
├── app/                    # Next.js App Router pages
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── supabase/           # Supabase clients and queries
│   └── utils/              # Utility functions (categorizer, calculator, etc.)
├── types/                  # TypeScript type definitions
└── docs/                   # Comprehensive documentation
    ├── setup-mcp.md        # MCP server setup guide
    ├── setup-supabase.md   # Supabase setup guide
    ├── architecture.md     # System architecture
    ├── schema.md           # Database schema details
    └── project_goals.md    # Business logic and goals
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Claude CLI (optional, for MCP servers)

### 2. Clone & Install

```bash
cd micro-saas
npm install
```

### 3. Set Up Supabase

Follow the detailed guide: [`docs/setup-supabase.md`](docs/setup-supabase.md)

Quick steps:
1. Create a Supabase project
2. Copy connection credentials
3. Run database migrations

```bash
supabase link --project-ref [your-project-ref]
supabase db push
```

### 4. Configure Environment Variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_CONNECTION_STRING=postgresql://...
WEBHOOK_SECRET=your-webhook-secret
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

All documentation is in the `docs/` directory:

- **[setup-mcp.md](docs/setup-mcp.md)**: Configure MCP servers for AI assistants
- **[setup-supabase.md](docs/setup-supabase.md)**: Complete Supabase setup guide
- **[architecture.md](docs/architecture.md)**: System architecture and data flow
- **[schema.md](docs/schema.md)**: Database schema specifications
- **[project_goals.md](docs/project_goals.md)**: Business logic and feature requirements

## Key Features

### Phase 1 (Current - Foundation Complete ✅)

- ✅ Portable MCP configuration for AI tools
- ✅ Database schema with 3 tables (vc_companies, post_categories, posts)
- ✅ TypeScript types matching LinkedIn JSON structure
- ✅ Supabase SSR clients (server & browser)
- ✅ Utility functions (categorizer, engagement calculator)
- ✅ Comprehensive documentation
- ✅ Context preservation system (`.cursorrules`)

### Phase 2 (Next - UI & Dashboard)

- [ ] Landing page with overview
- [ ] Dashboard layout with sidebar navigation
- [ ] Weekly posts feed
- [ ] Individual VC company pages
- [ ] Performance insights page
- [ ] Filtering and sorting

### Phase 3 (Future - Automation)

- [ ] Webhook endpoint for n8n
- [ ] n8n workflow setup
- [ ] Apify LinkedIn scraper integration
- [ ] Automated daily ingestion

## Database Schema

### vc_companies

Tracks VC firms to monitor.

**Columns**: `id`, `name`, `slug`, `linkedin_url`, `logo_url`, `follower_count`, `is_tracked`, `created_at`, `updated_at`

### post_categories

Lookup table for post categorization.

**Categories**: Events, Portfolio, Founders, Thought Leadership, Hiring, Other

### posts

LinkedIn posts with full metadata.

**Columns**: `id`, `vc_company_id`, `category_id`, `activity_urn`, `post_url`, `text_content`, `posted_at`, `engagement_score`, `stats` (JSONB), `raw_data` (JSONB), and more.

See [`docs/schema.md`](docs/schema.md) for full details.

## Business Logic

### Post Categorization

Posts are auto-categorized using keyword matching:

- **Events**: "conference", "webinar", "summit", etc.
- **Portfolio**: "investment", "funding", "raise", etc.
- **Founders**: "founder", "team", "welcome", etc.
- **Thought Leadership**: "insight", "trend", "perspective", etc.
- **Hiring**: "job", "career", "opportunity", etc.

### Engagement Scoring

Formula: `total_reactions + (comments × 2) + (reposts × 3)`

Weighted to prioritize deeper engagement (comments, reposts).

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

## MCP Server Configuration

This project includes portable MCP server configuration in `.mcp/config.json`.

MCP servers enable AI assistants (like Claude) to:
- Query the database directly
- Fetch external documentation
- Read/write project files

See [`docs/setup-mcp.md`](docs/setup-mcp.md) for setup instructions.

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms

- Netlify
- AWS Amplify
- Self-hosted (Docker + Node.js)

## Contributing

1. Read `.cursorrules` for coding standards
2. Follow commit message format: `type(scope): message`
3. Test locally before committing
4. Update documentation if needed

## License

Proprietary - Client Project

## Contact

For questions or support, contact the development team.

---

**Built with ❤️ using Next.js, Supabase, and Claude Code**
