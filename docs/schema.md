# Database Schema Documentation

This document provides detailed specifications for all database tables in the VC LinkedIn Intelligence Platform.

## Overview

The database consists of three main tables:
- `vc_companies`: Tracked venture capital firms
- `post_categories`: Lookup table for post categorization
- `posts`: LinkedIn posts with full metadata and engagement metrics

## Table: `vc_companies`

Stores information about tracked VC firms whose LinkedIn presence we're monitoring.

### Schema

| Column          | Type          | Constraints           | Description                                    |
|-----------------|---------------|-----------------------|------------------------------------------------|
| `id`            | UUID          | PRIMARY KEY, DEFAULT  | Unique identifier                              |
| `name`          | TEXT          | UNIQUE, NOT NULL      | Company name (e.g., "Shilling VC")             |
| `slug`          | TEXT          | UNIQUE, NOT NULL      | URL-friendly identifier (e.g., "shilling-vc")  |
| `linkedin_url`  | TEXT          | UNIQUE, NOT NULL      | Full LinkedIn company page URL                 |
| `logo_url`      | TEXT          | NULLABLE              | Company logo image URL                         |
| `follower_count`| INTEGER       | DEFAULT 0             | Latest follower count from LinkedIn            |
| `is_tracked`    | BOOLEAN       | DEFAULT true          | Whether we're actively tracking this company   |
| `created_at`    | TIMESTAMPTZ   | DEFAULT NOW()         | Record creation timestamp                      |
| `updated_at`    | TIMESTAMPTZ   | DEFAULT NOW()         | Last update timestamp (auto-updated via trigger)|

### Indexes

- `idx_vc_companies_slug`: B-tree index on `slug` for fast lookups by slug
- `idx_vc_companies_is_tracked`: Partial index on `is_tracked` WHERE `is_tracked = true`

### Row Level Security

- **Policy**: "Allow all operations on vc_companies"
- **Access**: All users can SELECT, INSERT, UPDATE, DELETE
- **Note**: For production, restrict based on authentication

### Example Data

```sql
INSERT INTO vc_companies (name, slug, linkedin_url, logo_url, follower_count) VALUES
('Shilling VC', 'shilling-vc', 'https://www.linkedin.com/company/shilling-capital-partners/', 'https://media.licdn.com/...', 10890),
('Sequoia Capital', 'sequoia-capital', 'https://www.linkedin.com/company/sequoia-capital/', 'https://media.licdn.com/...', 2500000);
```

### Triggers

- `update_vc_companies_updated_at`: Automatically updates `updated_at` on row UPDATE

---

## Table: `post_categories`

Lookup table for categorizing LinkedIn posts.

### Schema

| Column      | Type        | Constraints           | Description                                    |
|-------------|-------------|-----------------------|------------------------------------------------|
| `id`        | UUID        | PRIMARY KEY, DEFAULT  | Unique identifier                              |
| `name`      | TEXT        | UNIQUE, NOT NULL      | Display name (e.g., "Events")                  |
| `slug`      | TEXT        | UNIQUE, NOT NULL      | URL-friendly identifier (e.g., "events")       |
| `keywords`  | TEXT[]      | DEFAULT []            | Array of keywords for auto-categorization      |
| `color`     | TEXT        | DEFAULT '#6B7280'     | Hex color for UI badges                        |
| `created_at`| TIMESTAMPTZ | DEFAULT NOW()         | Record creation timestamp                      |

### Indexes

- `idx_post_categories_slug`: B-tree index on `slug`

### Row Level Security

- **Policy**: "Allow all operations on post_categories"
- **Access**: All users can SELECT, INSERT, UPDATE, DELETE

### Seed Data

The following categories are pre-seeded via migration:

| Name                | Slug                 | Keywords                                                  | Color     |
|---------------------|----------------------|-----------------------------------------------------------|-----------|
| Events              | events               | event, conference, webinar, meetup, summit, workshop      | #3B82F6   |
| Portfolio           | portfolio            | portfolio, investment, funding, raise, announcing, proud to share | #10B981   |
| Founders            | founders             | founder, team, meet, welcome, joined, hire                | #8B5CF6   |
| Thought Leadership  | thought-leadership   | trend, insight, future, perspective, analysis, opinion    | #F59E0B   |
| Hiring              | hiring               | hiring, job, career, opportunity, join us, we are looking | #EF4444   |
| Other               | other                | (empty - catch-all)                                       | #6B7280   |

### Usage

Categories are used for:
1. **Auto-categorization**: Posts are matched against keywords during ingestion
2. **Filtering**: Users can filter dashboard by category
3. **Analytics**: Category distribution insights

---

## Table: `posts`

Stores LinkedIn posts from tracked VC companies with full metadata and engagement metrics.

### Schema

| Column            | Type          | Constraints              | Description                                           |
|-------------------|---------------|--------------------------|-------------------------------------------------------|
| `id`              | UUID          | PRIMARY KEY, DEFAULT     | Unique identifier                                     |
| `vc_company_id`   | UUID          | FK → vc_companies(id)    | Reference to VC company                               |
| `category_id`     | UUID          | FK → post_categories(id) | Reference to post category (nullable)                 |
| `activity_urn`    | TEXT          | UNIQUE, NOT NULL         | LinkedIn activity URN (e.g., "7399008963234680832")   |
| `full_urn`        | TEXT          | NULLABLE                 | Full URN (e.g., "urn:li:ugcPost:7398759014425255936") |
| `post_url`        | TEXT          | UNIQUE, NOT NULL         | Direct link to LinkedIn post                          |
| `text_content`    | TEXT          | NULLABLE                 | Post text/caption                                     |
| `posted_at`       | TIMESTAMPTZ   | NOT NULL                 | When the post was published on LinkedIn               |
| `post_language`   | TEXT          | DEFAULT 'en'             | Language code (e.g., "en", "es")                      |
| `post_type`       | TEXT          | DEFAULT 'regular'        | Type (e.g., "regular", "video", "carousel")           |
| `engagement_score`| NUMERIC(10,2) | DEFAULT 0                | Calculated engagement score                           |
| `stats`           | JSONB         | DEFAULT '{}'             | Engagement statistics object                          |
| `media`           | JSONB         | DEFAULT '{}'             | Media object (images, videos)                         |
| `document`        | JSONB         | DEFAULT '{}'             | Document object (PDFs, carousels)                     |
| `raw_data`        | JSONB         | DEFAULT '{}'             | Full original JSON from Apify                         |
| `created_at`      | TIMESTAMPTZ   | DEFAULT NOW()            | Record creation timestamp                             |

### Foreign Keys

- `vc_company_id` → `vc_companies(id)` ON DELETE CASCADE
- `category_id` → `post_categories(id)` ON DELETE SET NULL

### Indexes

- `idx_posts_vc_company_id`: B-tree on `vc_company_id`
- `idx_posts_category_id`: B-tree on `category_id`
- `idx_posts_posted_at`: B-tree descending on `posted_at` (most recent first)
- `idx_posts_engagement_score`: B-tree descending on `engagement_score` (top performers)
- `idx_posts_activity_urn`: B-tree on `activity_urn` (uniqueness checks)
- `idx_posts_stats`: GIN index on `stats` JSONB column (for flexible queries)

### Row Level Security

- **Policy**: "Allow all operations on posts"
- **Access**: All users can SELECT, INSERT, UPDATE, DELETE
- **Note**: For production, restrict based on authentication

### JSONB Column Structures

#### `stats` Object

```json
{
  "total_reactions": 121,
  "like": 100,
  "love": 7,
  "celebrate": 14,
  "comments": 6,
  "reposts": 1
}
```

#### `document` Object (nullable)

```json
{
  "title": "Meet the Team | Ricardo Jacinto",
  "page_count": 6,
  "url": "https://media.licdn.com/dms/document/media/...",
  "thumbnail": "https://media.licdn.com/dms/image/..."
}
```

#### `media` Object (varies)

```json
{
  "images": ["url1", "url2"],
  "video_url": "https://...",
  "thumbnail": "https://..."
}
```

#### `raw_data` Object

Full original JSON from Apify scraper:

```json
{
  "activity_urn": "7399008963234680832",
  "full_urn": "urn:li:ugcPost:7398759014425255936",
  "post_url": "https://www.linkedin.com/posts/...",
  "text": "From consulting, founding a startup...",
  "posted_at": {
    "relative": "6d",
    "is_edited": false,
    "date": "2025-11-25 10:00:03",
    "timestamp": 1764061203774
  },
  "post_language_code": "en",
  "post_type": "regular",
  "author": {
    "name": "Shilling VC",
    "follower_count": 10890,
    "company_url": "https://www.linkedin.com/company/...",
    "logo_url": "https://media.licdn.com/..."
  },
  "stats": { /* engagement stats */ },
  "media": {},
  "document": { /* document object */ },
  "source_company": "https://www.linkedin.com/company/..."
}
```

### Example Query: Get Top Performers This Week

```sql
SELECT
  p.*,
  vc.name AS company_name,
  vc.logo_url AS company_logo,
  pc.name AS category_name,
  pc.color AS category_color
FROM posts p
JOIN vc_companies vc ON p.vc_company_id = vc.id
LEFT JOIN post_categories pc ON p.category_id = pc.id
WHERE p.posted_at >= NOW() - INTERVAL '7 days'
  AND vc.is_tracked = true
ORDER BY p.engagement_score DESC
LIMIT 10;
```

### Example Query: Category Distribution

```sql
SELECT
  pc.name AS category,
  COUNT(p.id) AS post_count,
  AVG(p.engagement_score) AS avg_engagement
FROM posts p
JOIN post_categories pc ON p.category_id = pc.id
WHERE p.posted_at >= NOW() - INTERVAL '30 days'
GROUP BY pc.id, pc.name
ORDER BY post_count DESC;
```

---

## Relationships

```
vc_companies (1) ───< (many) posts
                            │
                            │ (many-to-1)
                            ▼
                     post_categories (1)
```

- One VC company can have many posts
- One post belongs to one VC company
- One post can have one category (or null)
- One category can be assigned to many posts

---

## Migration Files

Schema is defined in version-controlled migration files:

1. `20250101000000_create_vc_companies_table.sql`
2. `20250101000001_create_post_categories_table.sql`
3. `20250101000002_create_posts_table.sql`
4. `20250101000003_seed_post_categories.sql`

Apply with:

```bash
supabase db push
```

---

## Performance Considerations

### Indexed Queries (Fast)

✅ Get posts by company: `WHERE vc_company_id = ?`
✅ Get recent posts: `WHERE posted_at >= ? ORDER BY posted_at DESC`
✅ Get top performers: `ORDER BY engagement_score DESC`
✅ Get posts by category: `WHERE category_id = ?`
✅ Search JSONB: `WHERE stats->>'comments' > '10'`

### Non-Indexed Queries (Slower)

⚠️ Full-text search on `text_content` (consider adding GIN index with tsvector)
⚠️ Complex JSONB queries without GIN index

---

## Backup & Recovery

### Automated Backups (Supabase)

- **Frequency**: Daily (free tier), point-in-time recovery (paid)
- **Retention**: 7 days (free tier), 30+ days (paid)
- **Location**: Same region as database

### Manual Backup

```bash
pg_dump "$SUPABASE_CONNECTION_STRING" > backup.sql
```

### Restore

```bash
psql "$SUPABASE_CONNECTION_STRING" < backup.sql
```

---

## Data Retention Policy

### Current Policy

- **Posts**: Retained indefinitely
- **Companies**: Never deleted (soft delete via `is_tracked = false`)
- **Categories**: Never deleted

### Future Considerations

- Archive posts older than 2 years
- Anonymize data for GDPR compliance
- Add `deleted_at` column for soft deletes

---

## References

- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase Database Guides](https://supabase.com/docs/guides/database)
- [Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)
