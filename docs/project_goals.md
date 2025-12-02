# Project Goals & Business Logic

This document outlines the business objectives, feature requirements, and core logic for the VC LinkedIn Intelligence Platform.

## Business Context

### Client

A venture capital firm seeking to monitor competitor VC firms' LinkedIn strategies.

### Problem Statement

VC firms invest heavily in LinkedIn content to:
- Showcase portfolio companies
- Attract founders
- Share thought leadership
- Build brand reputation

**Challenge**: Manually tracking dozens of competitor VC firms across LinkedIn is time-consuming and lacks data-driven insights.

### Solution

An automated intelligence platform that:
1. Scrapes competitor VC LinkedIn pages daily
2. Categorizes and scores content
3. Surfaces top-performing posts and trends
4. Enables strategic benchmarking

---

## Core Features

### 1. Weekly Dashboard

**Goal**: Quick overview of what's happened in the past 7 days across all tracked VC companies.

**Requirements**:
- Feed of all posts from last 7 days
- Sort by:
  - Most recent (default)
  - Highest engagement
  - By company
- Filter by:
  - VC company
  - Post category
  - Date range

**Success Metrics**:
- User can identify top posts in < 30 seconds
- Dashboard loads in < 2 seconds

---

### 2. VC Company Pages

**Goal**: Deep-dive analysis of individual competitor VC firms.

**URL Structure**: `/dashboard/companies/[slug]`
Example: `/dashboard/companies/sequoia-capital`

**Requirements**:
- List of all posts from this company
- Engagement trends chart (line graph over time)
- Category distribution (pie chart):
  - % Events
  - % Portfolio
  - % Founders
  - % Thought Leadership
  - % Hiring
  - % Other
- Company metadata:
  - Logo
  - LinkedIn URL
  - Follower count
  - Total posts tracked

**Success Metrics**:
- User can compare two VC companies' strategies
- Identify which categories a competitor focuses on

---

### 3. Insights Page

**Goal**: High-level analytics and trends across all tracked VC companies.

**URL**: `/dashboard/insights`

**Requirements**:

#### Top Performing Posts
- This Week: Top 10 posts by engagement score
- This Month: Top 20 posts by engagement score
- All Time: Top 50 posts by engagement score

#### Most Active VC Companies
- Ranked by post frequency (last 30 days)
- Ranked by total engagement (last 30 days)

#### Category Distribution
- Pie chart: % of posts per category (all companies)
- Bar chart: Post count per category over time

#### Engagement Trends
- Line chart: Average engagement score over time (daily/weekly/monthly)
- Comparison: Multiple VC companies on same chart

**Success Metrics**:
- User can identify which categories get most engagement
- User can spot emerging content trends

---

## Business Logic

### Post Categorization

**Purpose**: Automatically classify posts into meaningful buckets for analysis.

**Categories**:

1. **Events**
   - Conferences, webinars, summits, workshops, meetups
   - Example: "Join us at TechCrunch Disrupt 2025"

2. **Portfolio**
   - Portfolio company announcements, funding rounds, exits
   - Example: "Proud to share our portfolio company XYZ raised $50M Series B"

3. **Founders**
   - Founder spotlights, team introductions, new hires
   - Example: "Meet Jane Doe, our newest Partner"

4. **Thought Leadership**
   - Industry insights, trend analysis, opinion pieces
   - Example: "Why we believe AI will transform healthcare"

5. **Hiring**
   - Job postings, career opportunities, team growth
   - Example: "We're hiring a Senior Associate to join our team"

6. **Other**
   - Catch-all for uncategorized posts

**Implementation**:

**File**: `lib/utils/postCategorizer.ts`

**Algorithm**:
1. Load category keywords from database
2. Convert post text to lowercase
3. Check each category (except "Other") for keyword matches
4. Return first matching category slug
5. If no match, return "other"

**Example**:

```typescript
const text = "Join us at Web Summit 2025 for an exclusive panel discussion";
// Contains "summit" (keyword for Events)
// Result: "events"

const text = "Proud to announce our investment in Acme Corp's Series A";
// Contains "investment" (keyword for Portfolio)
// Result: "portfolio"
```

**Keyword Expansion**:
Clients can add more keywords via database updates:

```sql
UPDATE post_categories
SET keywords = array_append(keywords, 'roundtable')
WHERE slug = 'events';
```

---

### Engagement Scoring

**Purpose**: Rank posts by "engagement quality" to surface top performers.

**Formula**:

```
engagement_score = total_reactions + (comments × 2) + (reposts × 3)
```

**Rationale**:

- **Reactions** (like, love, celebrate): Low-effort, weight = 1×
  - Easy to click, shows mild interest

- **Comments**: Medium-effort, weight = 2×
  - Requires thought, shows deeper engagement

- **Reposts** (shares): High-effort, weight = 3×
  - Strongest endorsement (person stakes reputation)

**Implementation**:

**File**: `lib/utils/engagementCalculator.ts`

**Example**:

Post A:
- 100 reactions
- 5 comments
- 2 reposts
- **Score**: 100 + (5 × 2) + (2 × 3) = **116**

Post B:
- 50 reactions
- 20 comments
- 5 reposts
- **Score**: 50 + (20 × 2) + (5 × 3) = **105**

Despite fewer reactions, Post B has higher score due to comments/reposts.

**Normalization** (Future Enhancement):

Adjust for company follower count:

```
normalized_score = engagement_score / (follower_count / 1000)
```

This prevents large companies from always dominating top posts.

---

### Data Ingestion Workflow

**Trigger**: Daily at 9 AM UTC

**Steps**:

1. **Apify Actor Runs**
   - Scrapes each tracked VC company's LinkedIn page
   - Extracts last 50 posts per company
   - Sends JSON to n8n webhook

2. **n8n Receives Data**
   - Validates JSON structure
   - Extracts `author` object (company metadata)
   - Calculates `engagement_score`
   - Categorizes post using keyword matching
   - Transforms JSON to match database schema

3. **n8n Calls Webhook Endpoint**
   - POST to `/api/webhook`
   - Headers: `{ "x-webhook-secret": "..." }`
   - Body:
     ```json
     {
       "company": {
         "name": "Shilling VC",
         "linkedin_url": "...",
         "logo_url": "...",
         "follower_count": 10890
       },
       "post": {
         "activity_urn": "...",
         "post_url": "...",
         "text": "...",
         "posted_at": "2025-11-25T10:00:03Z",
         "stats": { /* ... */ },
         "engagement_score": 116,
         "category_slug": "events",
         "raw_data": { /* full JSON */ }
       }
     }
     ```

4. **Next.js API Route**
   - Validates webhook secret
   - Upserts VC company (by `linkedin_url`)
   - Finds `category_id` by slug
   - Inserts post (skip if `activity_urn` exists)
   - Returns 200 OK

**Error Handling**:
- Invalid secret → 401 Unauthorized
- Missing fields → 400 Bad Request
- Database error → 500 Internal Server Error
- Duplicate `activity_urn` → 200 OK (idempotent)

---

## User Workflows

### Workflow 1: Weekly Check-In (5 minutes)

1. User opens `/dashboard`
2. Sees feed of last 7 days' posts
3. Scans top 10 posts by engagement
4. Clicks on interesting post → opens LinkedIn in new tab
5. Filters by specific competitor → sees their posts only
6. Done

### Workflow 2: Competitive Analysis (15 minutes)

1. User opens `/dashboard/companies/sequoia-capital`
2. Reviews engagement trend chart
3. Notes that Portfolio posts perform best for Sequoia
4. Opens `/dashboard/companies/andreessen-horowitz`
5. Compares: a16z focuses more on Thought Leadership
6. Insight: Different content strategies
7. Done

### Workflow 3: Content Strategy Planning (30 minutes)

1. User opens `/dashboard/insights`
2. Reviews "Top Performing Posts This Month"
3. Identifies patterns:
   - Event announcements get high engagement
   - Posts with founders' faces perform better
4. Checks category distribution:
   - Events = 15%, Portfolio = 35%, Thought Leadership = 30%
5. Decision: Increase event-related posts
6. Done

---

## Success Criteria

### Phase 1 (MVP)

✅ Track at least 10 VC companies
✅ Ingest posts daily via n8n
✅ Auto-categorize with 70%+ accuracy
✅ Dashboard loads in < 3 seconds
✅ Client can identify top posts in < 1 minute

### Phase 2 (Enhancements)

- AI-powered insights (GPT-4 summarization)
- Email alerts for competitor viral posts
- Export reports to PDF/CSV
- Multi-tenancy (multiple clients)

### Phase 3 (Scale)

- Track 100+ VC companies
- Real-time updates via Supabase subscriptions
- Sentiment analysis on comments
- Predictive analytics (forecast engagement)

---

## KPIs (Key Performance Indicators)

### Product KPIs

- **Data Freshness**: Posts ingested within 24 hours of publication
- **Categorization Accuracy**: 80%+ (manual spot-check)
- **Uptime**: 99.5% availability
- **Load Time**: < 2 seconds (p95)

### Business KPIs

- **Client Usage**: 3+ logins per week
- **Insight Actionability**: Client references insights in strategy meetings
- **Retention**: 90%+ month-over-month

---

## Future Enhancements

### AI-Powered Insights

**GPT-4 Integration**:
- Summarize weekly trends in plain English
- Generate content suggestions based on top performers
- Sentiment analysis on post comments

Example output:

> "This week, competitor Sequoia Capital posted 12 times, focusing heavily on Portfolio updates (60%). Their top post featured a founder interview, achieving 450 engagement points. Consider similar founder-focused content."

### Alerts & Notifications

**Email Alerts**:
- Daily digest: Top 3 posts from yesterday
- Real-time alert: Competitor post goes viral (> 500 engagement)
- Weekly summary: Trend analysis

**Slack Integration**:
- Post top performers to Slack channel
- @ mention specific team members

### Export & Reporting

**PDF Reports**:
- Monthly competitive analysis report
- Include charts, top posts, insights
- Branded with client logo

**CSV Exports**:
- All posts for custom analysis
- Company-level engagement metrics

---

## Technical Constraints

### Rate Limits

- **LinkedIn**: Apify respects LinkedIn's rate limits
- **Supabase**: Free tier = 50,000 rows (sufficient for 1,000+ posts/company)
- **Vercel**: Free tier = 100 GB bandwidth/month

### Data Retention

- **Storage**: ~1 MB per post (with JSONB raw data)
- **Estimate**: 10 companies × 50 posts/month × 12 months = 6,000 posts = ~6 GB
- **Solution**: Archive old posts to S3 after 1 year

---

## Glossary

- **Engagement Score**: Weighted metric combining reactions, comments, reposts
- **Activity URN**: LinkedIn's unique identifier for a post
- **VC Company**: Venture capital firm (e.g., Sequoia, Andreessen Horowitz)
- **Category**: Post classification (Events, Portfolio, Founders, etc.)
- **n8n**: Workflow automation tool (alternative to Zapier)
- **Apify**: Web scraping platform

---

## References

- LinkedIn Post Structure: [Apify LinkedIn Scraper Docs](https://apify.com/apify/linkedin-company-scraper)
- Engagement Metrics: [LinkedIn Analytics Best Practices](https://business.linkedin.com/marketing-solutions/linkedin-pages/best-practices)
- Competitor Analysis: [VC Content Strategy Guide](https://example.com)
