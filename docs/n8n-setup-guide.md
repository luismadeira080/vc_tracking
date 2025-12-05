# n8n Workflow Setup Guide

Complete step-by-step guide to set up automated LinkedIn scraping with n8n.

---

## Prerequisites

Before you start, you need:

1. ✅ **Next.js app running** (local or production)
2. ✅ **Supabase database configured**
3. ✅ **Webhook endpoint active** (`/api/webhook`)
4. ⏳ **n8n instance** (we'll set this up)
5. ⏳ **Apify account** (we'll set this up)

---

## Part 1: Set Up Apify Account

### Step 1: Create Apify Account

1. Go to https://apify.com/
2. Click **"Sign up"**
3. Create free account (includes $5 free credit)

### Step 2: Get API Token

1. After logging in, click your **profile icon** (top right)
2. Go to **Settings** → **Integrations**
3. Copy your **API Token**
4. Save it securely (you'll need this for n8n)

Example: `apify_api_AbCdEf123456789...`

### Step 3: Test the LinkedIn Scraper

1. Go to https://apify.com/apify/linkedin-posts-scraper
2. Click **"Try for free"**
3. In the **Input** section, add a test URL:

```json
{
  "startUrls": [
    { "url": "https://www.linkedin.com/company/sequoia-capital" }
  ],
  "maxPosts": 5
}
```

4. Click **"Start"**
5. Wait 30-60 seconds
6. Check **Dataset** tab - you should see scraped posts in JSON format

**Costs**: ~$0.05-0.10 per 100 posts (very affordable)

---

## Part 2: Set Up n8n

### Option A: Cloud n8n (Recommended for Beginners)

1. Go to https://n8n.io/
2. Click **"Start free"**
3. Create account (free tier: 5,000 executions/month)
4. You'll get a cloud instance: `https://your-name.app.n8n.cloud`

### Option B: Self-Hosted n8n (Docker)

```bash
# Install n8n with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Access at: http://localhost:5678

### Option C: npm Install

```bash
npm install n8n -g
n8n start
```

Access at: http://localhost:5678

---

## Part 3: Import Workflow

### Step 1: Download Workflow File

The workflow JSON is already in your project:
`/Users/luismadeira/Documents/micro-saas/n8n-workflow.json`

### Step 2: Import to n8n

1. Open n8n dashboard
2. Click **"Workflows"** in left sidebar
3. Click **"Add workflow"** → **"Import from File"**
4. Select `n8n-workflow.json`
5. Click **"Import"**

You should now see 3 nodes:
- **Schedule Trigger** (clock icon)
- **Apify LinkedIn Scraper** (HTTP request)
- **Send to Webhook** (HTTP request)

---

## Part 4: Configure Workflow Nodes

### Node 1: Schedule Trigger (Already Configured)

**Purpose**: Runs workflow automatically every day at 9am

**Settings**:
- Trigger Interval: Cron expression
- Expression: `0 9 * * *` (9am daily)

**To change schedule**:
- Every 6 hours: `0 */6 * * *`
- Twice daily (9am, 9pm): `0 9,21 * * *`
- Weekly (Monday 9am): `0 9 * * 1`

---

### Node 2: Apify LinkedIn Scraper

**Purpose**: Scrapes LinkedIn posts from Portuguese VC companies

#### Step-by-Step Configuration:

1. **Click on "Apify LinkedIn Scraper" node**

2. **Update the Authorization header**:
   - Find: `"value": "Bearer YOUR_APIFY_API_TOKEN"`
   - Replace with: `"value": "Bearer apify_api_YOUR_ACTUAL_TOKEN"`

3. **Update Company URLs**:

Replace the `jsonBody` with Portuguese VC companies:

```json
{
  "startUrls": [
    { "url": "https://www.linkedin.com/company/indico-capital-partners" },
    { "url": "https://www.linkedin.com/company/armilar-venture-partners" },
    { "url": "https://www.linkedin.com/company/portugal-ventures" },
    { "url": "https://www.linkedin.com/company/busy-angels" },
    { "url": "https://www.linkedin.com/company/seedrs" },
    { "url": "https://www.linkedin.com/company/faber-ventures" },
    { "url": "https://www.linkedin.com/company/shilling-vc" },
    { "url": "https://www.linkedin.com/company/bynd-venture-capital" },
    { "url": "https://www.linkedin.com/company/golden-ventures" },
    { "url": "https://www.linkedin.com/company/maze-x" }
  ],
  "maxPosts": 20,
  "scrapeComments": false,
  "scrapePostStats": true
}
```

4. **Adjust scraping parameters**:
   - `maxPosts`: Number of recent posts per company (20 recommended)
   - `scrapePostStats`: true (get likes, comments, reposts)
   - `scrapeComments`: false (faster, cheaper)

5. **Set timeout**:
   - Under "Options" → Timeout: `180000` (3 minutes)

6. **Click "Save"**

---

### Node 3: Send to Webhook

**Purpose**: Sends scraped posts to your Next.js webhook

#### Step-by-Step Configuration:

1. **Click on "Send to Webhook" node**

2. **Update webhook URL**:

**For local testing:**
```
http://localhost:3000/api/webhook
```

**For production (after deploying):**
```
https://your-domain.vercel.app/api/webhook
```

3. **Verify Authorization header**:
```
Bearer 5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d
```

This should match your `WEBHOOK_SECRET` in `.env.local`

4. **Verify JSON body**:
```
{{ { "posts": $json } }}
```

This wraps the Apify response in the format your webhook expects.

5. **Click "Save"**

---

## Part 5: Test the Workflow

### Manual Test (Recommended First)

1. **Click "Test workflow"** button (top right)
2. The workflow will execute immediately
3. Watch each node turn green as it completes
4. Check execution time (should be 30-90 seconds)

**Expected Results**:

**Node 1 (Schedule Trigger):**
```json
{
  "timestamp": "2025-12-03T09:00:00.000Z"
}
```

**Node 2 (Apify Scraper):**
```json
[
  {
    "activity_urn": "urn:li:activity:...",
    "text": "Excited to announce...",
    "author": { "name": "Indico Capital Partners" },
    "stats": { "total_reactions": 150, ... }
  },
  // ... more posts
]
```

**Node 3 (Send to Webhook):**
```json
{
  "message": "Webhook processed",
  "results": {
    "success": 45,
    "failed": 0,
    "skipped": 0,
    "errors": []
  }
}
```

### Check Your Dashboard

1. Open http://localhost:3000/dashboard
2. You should see posts from Portuguese VCs!
3. Check `/dashboard/companies` - should list all scraped companies
4. Check `/dashboard/insights` - should show statistics

---

## Part 6: Activate Automated Schedule

### Enable the Workflow

1. Click the **toggle switch** at the top (turns blue when active)
2. Click **"Save"**
3. The workflow will now run automatically every day at 9am

### Monitor Executions

1. Go to **"Executions"** in n8n sidebar
2. See history of all runs
3. Click any execution to see details
4. Check for errors or failures

---

## Troubleshooting

### Issue: Apify returns empty array

**Causes:**
- LinkedIn URLs are incorrect
- Companies have no recent posts
- Apify rate limit reached

**Solutions:**
1. Test URLs manually on LinkedIn
2. Check Apify dashboard for errors
3. Increase `maxPosts` parameter
4. Wait 24 hours if rate limited

---

### Issue: Webhook returns 401 Unauthorized

**Cause:** Authorization token mismatch

**Solution:**
1. Check `WEBHOOK_SECRET` in `.env.local`
2. Verify Bearer token in n8n node 3
3. Ensure no extra spaces or quotes

---

### Issue: Posts not appearing in dashboard

**Causes:**
- Webhook failed
- Posts are duplicates (already exist)
- Posts older than 7 days (dashboard shows last 7 days only)

**Solutions:**
1. Check webhook response in n8n execution log
2. Look at `results.skipped` count (duplicates)
3. Check Supabase Table Editor → `posts` table
4. Verify `posted_at` timestamps

---

### Issue: n8n timeout error

**Cause:** Scraping too many companies/posts at once

**Solutions:**
1. Reduce number of companies
2. Reduce `maxPosts` per company
3. Increase timeout in node 2 to 300000 (5 minutes)
4. Split into multiple workflows

---

## Portuguese VC Companies to Track

Here's a comprehensive list of Portuguese VC firms with their LinkedIn URLs:

### Tier 1 (Most Active)

```json
{
  "url": "https://www.linkedin.com/company/indico-capital-partners",
  "name": "Indico Capital Partners"
},
{
  "url": "https://www.linkedin.com/company/armilar-venture-partners",
  "name": "Armilar Venture Partners"
},
{
  "url": "https://www.linkedin.com/company/portugal-ventures",
  "name": "Portugal Ventures"
},
{
  "url": "https://www.linkedin.com/company/busy-angels",
  "name": "Busy Angels"
}
```

### Tier 2 (Active)

```json
{
  "url": "https://www.linkedin.com/company/faber-ventures",
  "name": "Faber Ventures"
},
{
  "url": "https://www.linkedin.com/company/shilling-vc",
  "name": "Shilling VC"
},
{
  "url": "https://www.linkedin.com/company/bynd-venture-capital",
  "name": "BYND Venture Capital"
},
{
  "url": "https://www.linkedin.com/company/golden-ventures",
  "name": "Golden Ventures"
}
```

### Additional Options

```json
{
  "url": "https://www.linkedin.com/company/maze-x",
  "name": "Maze X"
},
{
  "url": "https://www.linkedin.com/company/seedrs",
  "name": "Seedrs"
},
{
  "url": "https://www.linkedin.com/company/iberis-capital",
  "name": "Iberis Capital"
}
```

**Note**: Start with 5-10 companies to test, then expand.

---

## Cost Estimation

### Apify Costs

- **Per execution**: ~$0.05-0.15
- **10 companies × 20 posts**: ~$0.10
- **Daily runs (30 days)**: ~$3.00/month
- **Free tier**: $5 credit (covers ~50 executions)

### n8n Costs

- **Cloud free tier**: 5,000 executions/month
- **Daily workflow**: 30 executions/month (well within free tier)
- **Self-hosted**: $0 (if you have server)

**Total monthly cost**: ~$3-5 (very affordable!)

---

## Best Practices

### 1. Start Small
- Begin with 3-5 companies
- Run manually for first week
- Verify data quality before scaling

### 2. Monitor Regularly
- Check n8n executions weekly
- Review webhook responses
- Watch Apify credit usage

### 3. Handle Errors
- Set up n8n error notifications (email/Slack)
- Check execution logs
- Have fallback plan for failures

### 4. Optimize Scraping
- Don't scrape more often than necessary (daily is good)
- Adjust `maxPosts` based on company activity
- Consider weekend pauses (fewer posts published)

---

## Next Steps After Setup

1. **Let it run for 7 days** to build up data
2. **Analyze insights page** for patterns
3. **Add more companies** gradually
4. **Adjust categories** if needed (in Supabase)
5. **Deploy to production** (Vercel recommended)
6. **Share dashboard** with team

---

## Additional Resources

- [Apify LinkedIn Scraper Docs](https://apify.com/apify/linkedin-posts-scraper)
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Workflow Examples](https://n8n.io/workflows/)
- [Cron Expression Generator](https://crontab.guru/)

---

## Support

If you encounter issues:

1. Check n8n execution logs (detailed error messages)
2. Test Apify scraper directly on Apify platform
3. Verify webhook with curl (see `docs/webhook-setup.md`)
4. Check Supabase logs in dashboard
5. Review this guide's troubleshooting section

---

**You're all set! 🎉**

Once you complete these steps, your dashboard will automatically update daily with fresh LinkedIn posts from Portuguese VCs.
