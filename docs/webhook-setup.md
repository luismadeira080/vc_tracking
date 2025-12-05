# Webhook API Reference

Complete API documentation for the LinkedIn post webhook endpoint.

## Endpoint Details

**URL**: `https://your-domain.com/api/webhook`
**Method**: `POST`
**Authentication**: Bearer token

### Headers

```
Content-Type: application/json
Authorization: Bearer YOUR_WEBHOOK_SECRET
```

## Request Format

### Request Body

```json
{
  "posts": [
    {
      "activity_urn": "urn:li:activity:123456789",
      "full_urn": "urn:li:share:123456789",
      "post_url": "https://www.linkedin.com/posts/...",
      "text": "Post content here...",
      "posted_at": {
        "relative": "2 days ago",
        "is_edited": false,
        "date": "2025-12-01",
        "timestamp": 1733011200000
      },
      "post_language_code": "en",
      "post_type": "text",
      "author": {
        "name": "Company Name",
        "follower_count": 2500000,
        "company_url": "https://www.linkedin.com/company/...",
        "logo_url": "https://example.com/logo.png"
      },
      "stats": {
        "total_reactions": 1250,
        "like": 800,
        "love": 200,
        "celebrate": 250,
        "comments": 45,
        "reposts": 30
      },
      "media": {
        "images": [
          {
            "url": "https://example.com/image.jpg"
          }
        ]
      },
      "source_company": "Company Name"
    }
  ]
}
```

### Required Fields

- `posts` (array): Array of post objects
- `activity_urn` (string): Unique LinkedIn activity identifier
- `post_url` (string): URL to LinkedIn post
- `text` (string): Post content
- `posted_at.timestamp` (number): Unix timestamp in milliseconds
- `author.name` (string): Company name
- `stats.total_reactions` (number): Total reaction count
- `stats.comments` (number): Comment count
- `stats.reposts` (number): Repost count

### Optional Fields

- `source_company` (string): Override company name
- `author.follower_count` (number): LinkedIn follower count
- `author.company_url` (string): LinkedIn company page URL
- `author.logo_url` (string): Company logo URL
- `media.images` (array): Array of image objects with `url` field

## Response Format

### Success (200)

```json
{
  "message": "Webhook processed",
  "results": {
    "success": 2,
    "failed": 0,
    "skipped": 0,
    "errors": []
  }
}
```

**Fields:**
- `success`: Number of posts successfully processed
- `failed`: Number of posts that failed to process
- `skipped`: Number of duplicate posts (already exist)
- `errors`: Array of error messages

### Authentication Error (401)

```json
{
  "error": "Unauthorized"
}
```

### Validation Error (400)

```json
{
  "error": "No posts provided"
}
```

or

```json
{
  "error": "Invalid request body"
}
```

## Testing

### Health Check

Test if the webhook is active:

```bash
curl https://your-domain.com/api/webhook
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Webhook endpoint is active"
}
```

### Send Test Data

```bash
curl -X POST https://your-domain.com/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -d @test-webhook.json
```

### Local Testing

For local development:

```bash
# Start Next.js dev server
npm run dev

# Test webhook (in another terminal)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d" \
  -d '{
    "posts": [{
      "activity_urn": "test:123",
      "post_url": "https://linkedin.com/posts/test",
      "text": "Test post",
      "posted_at": {"timestamp": 1733011200000},
      "author": {"name": "Test Company"},
      "stats": {"total_reactions": 10, "comments": 2, "reposts": 1}
    }]
  }'
```

## Authentication

### Webhook Secret

Your webhook secret is stored in `.env.local`:

```bash
WEBHOOK_SECRET=5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d
```

**IMPORTANT**:
- Keep this secret secure
- Never commit to version control
- Anyone with this token can send data to your webhook
- Rotate the secret if compromised

### Generating a New Secret

```bash
openssl rand -hex 32
```

Update in `.env.local` and n8n workflow after generation.

## Webhook Behavior

### Automatic Processing

The webhook automatically:
1. ✅ Validates authentication token
2. ✅ Creates or updates VC companies
3. ✅ Categorizes posts using keyword matching
4. ✅ Calculates engagement scores
5. ✅ Stores posts in database
6. ✅ Skips duplicates (based on `activity_urn`)

### Duplicate Handling

Posts are identified by `activity_urn`. If a post with the same URN already exists:
- It's counted as "skipped"
- No error is thrown
- Idempotent behavior (safe to re-run)

### Company Creation

If a company doesn't exist in the database:
- Automatically created from `author.name` or `source_company`
- Slug generated from company name
- Logo and follower count saved if provided

## Rate Limits

**Current:** No rate limiting implemented

**Recommended for production:**
- 100 requests per minute
- 1000 requests per hour
- Implement using middleware or Vercel Edge Config

## Security

### Current Implementation
- ✅ Bearer token authentication
- ✅ Secret stored in environment variable
- ✅ HTTPS required in production

### Recommendations
- Add request size limits (prevent large payload attacks)
- Implement rate limiting
- Log all webhook requests for auditing
- Set up monitoring alerts for failed requests

## Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Apify LinkedIn Scraper](https://apify.com/apify/linkedin-posts-scraper)
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
