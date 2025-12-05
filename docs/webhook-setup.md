# Webhook Setup Guide

This guide explains how to set up the webhook endpoint to receive LinkedIn post data from n8n.

## Overview

The webhook endpoint accepts LinkedIn post data from the Apify scraper (via n8n) and automatically:
1. Creates or updates VC companies
2. Categorizes posts using keyword matching
3. Calculates engagement scores
4. Stores posts in the database
5. Skips duplicates

## Endpoint Details

**URL**: `https://your-domain.com/api/webhook`
**Method**: `POST`
**Authentication**: Bearer token

### Headers

```
Content-Type: application/json
Authorization: Bearer YOUR_WEBHOOK_SECRET
```

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
      "media": {},
      "source_company": "Company Name"
    }
  ]
}
```

### Response

#### Success (200)

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

#### Authentication Error (401)

```json
{
  "error": "Unauthorized"
}
```

#### Validation Error (400)

```json
{
  "error": "No posts provided"
}
```

## Testing the Webhook

### Health Check

Test if the webhook is active:

```bash
curl https://your-domain.com/api/webhook
```

Response:
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

## Webhook Secret

Your webhook secret is stored in `.env.local`:

```bash
WEBHOOK_SECRET=5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d
```

**IMPORTANT**: Keep this secret secure. Anyone with this token can send data to your webhook.

## Post Categorization

Posts are automatically categorized based on keywords:

- **Events**: conference, webinar, summit, workshop, meetup, event, panel
- **Portfolio**: investment, portfolio, funding, raise, series, round, backed
- **Founders**: founder, team, welcome, join, hiring, joined
- **Thought Leadership**: insight, trend, perspective, future, prediction, analysis
- **Hiring**: job, career, opportunity, position, role, opening
- **Other**: Default category if no keywords match

## Engagement Score Formula

```
score = total_reactions + (comments × 2) + (reposts × 3)
```

Reposts are weighted highest (3×) because they show the strongest endorsement.

## n8n Workflow Setup

### 1. Create n8n Workflow

1. **HTTP Request Node** (Apify)
   - Method: POST
   - URL: `https://api.apify.com/v2/acts/apify~linkedin-posts-scraper/run-sync-get-dataset-items`
   - Headers: `Authorization: Bearer APIFY_API_TOKEN`
   - Body: Company LinkedIn URLs to scrape

2. **Transform Data Node**
   - Map Apify response to webhook format
   - Ensure all required fields are present

3. **HTTP Request Node** (Your Webhook)
   - Method: POST
   - URL: `https://your-domain.com/api/webhook`
   - Headers:
     ```
     Content-Type: application/json
     Authorization: Bearer YOUR_WEBHOOK_SECRET
     ```
   - Body: Transformed post data

### 2. Schedule the Workflow

Set the workflow to run:
- **Daily** at 9am to capture recent posts
- Or **Weekly** for less frequent updates

### 3. Monitor Results

Check the webhook response for:
- `success`: Number of posts successfully processed
- `failed`: Number of posts that failed
- `skipped`: Number of duplicate posts
- `errors`: Array of error messages

## Troubleshooting

### Posts not appearing in dashboard

1. Check webhook response for errors
2. Verify posts were created: Check Supabase Table Editor → `posts`
3. Check company was created: Check `vc_companies` table
4. Verify `posted_at` timestamp is recent (dashboard shows last 7 days)

### Authentication failures

1. Verify `WEBHOOK_SECRET` matches in `.env.local`
2. Check Authorization header format: `Bearer SECRET` (with space)
3. Ensure secret is not exposed in logs or client-side code

### Duplicate posts

This is normal! The webhook automatically skips posts that already exist (based on `activity_urn`). This prevents data duplication when re-running n8n workflows.

### Company not recognized

The webhook automatically creates companies if they don't exist. Check:
- `source_company` field in request payload
- `author.name` field as fallback
- Resulting slug in `vc_companies` table

## Next Steps

1. Deploy your Next.js app to production (Vercel recommended)
2. Update n8n webhook URL to production domain
3. Set up Apify account and get LinkedIn scraper API token
4. Configure n8n workflow with company URLs to track
5. Schedule automated runs
6. Monitor dashboard for incoming posts

## Security Considerations

- ✅ Webhook uses Bearer token authentication
- ✅ Secret stored in environment variable (not in code)
- ✅ HTTPS required in production
- ⚠️ Rate limiting not implemented (consider adding if needed)
- ⚠️ Request size limits (default Next.js limits apply)

## Resources

- [Apify LinkedIn Scraper](https://apify.com/apify/linkedin-posts-scraper)
- [n8n Documentation](https://docs.n8n.io/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
