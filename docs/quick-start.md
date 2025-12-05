# Quick Start Guide

Get your VC LinkedIn Intelligence Platform up and running in 30 minutes.

---

## ✅ Checklist

### Already Done
- [x] Next.js app configured
- [x] Supabase database set up
- [x] Database tables created
- [x] Webhook endpoint active
- [x] Dashboard UI built
- [x] Media preview support added

### To Do
- [ ] Create Apify account
- [ ] Set up n8n instance
- [ ] Import workflow
- [ ] Configure nodes
- [ ] Test workflow
- [ ] Deploy to production

---

## 📋 What You Have

### Project Files
```
micro-saas/
├── app/
│   ├── dashboard/          # Dashboard pages (✅ working)
│   └── api/webhook/        # Webhook endpoint (✅ working)
├── docs/
│   ├── n8n-setup-guide.md  # Complete n8n setup (read this!)
│   └── webhook-setup.md    # Webhook documentation
├── n8n-workflow.json       # Import-ready workflow
└── .env.local              # Your credentials
```

### Your Credentials
```bash
# Webhook
http://localhost:3000/api/webhook
Bearer 5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d

# Supabase
URL: https://exonxmdewywsqlwmrewb.supabase.co
```

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Create Apify Account (5 min)
1. Go to https://apify.com/
2. Sign up (free)
3. Copy API token from Settings → Integrations
4. Save token: `apify_api_...`

### Step 2: Set Up n8n (5 min)
**Option A - Cloud (easiest):**
1. Go to https://n8n.io/
2. Sign up for free
3. You get: `https://yourname.app.n8n.cloud`

**Option B - Docker:**
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

### Step 3: Import Workflow (2 min)
1. Open n8n dashboard
2. Click "Workflows" → "Import from File"
3. Select `n8n-workflow.json`
4. Click "Import"

### Step 4: Configure Nodes (10 min)
1. **Node 1: Schedule Trigger** - Already set (daily 9am)
2. **Node 2: Apify Scraper** - Update:
   - Authorization: `Bearer YOUR_APIFY_TOKEN`
   - Keep Portuguese VC URLs (already in JSON)
3. **Node 3: Webhook** - Update:
   - URL: `http://localhost:3000/api/webhook` (for testing)
   - Authorization: Already set

### Step 5: Test (5 min)
1. Click "Test workflow"
2. Wait 30-60 seconds
3. Check green checkmarks on all nodes
4. Open http://localhost:3000/dashboard
5. See posts appear!

### Step 6: Activate (1 min)
1. Toggle switch to ON
2. Click "Save"
3. Done! Runs daily at 9am

---

## 📊 What to Expect

### First Run
- **Duration**: 10-12 minutes (13 companies sequential)
- **Posts scraped**: 5-10 posts per company (most recent)
- **Companies created**: 13
- **Cost**: ~$0.20

### After 7 Days
- **Posts in database**: 40-50 posts
- **Dashboard**: Showing recent activity
- **Insights**: Initial patterns visible
- **Categories**: Distribution emerging

### After 1 Month
- **Posts in database**: 160-200 posts
- **Analytics**: Sufficient data for comparisons
- **Top performers**: Clear engagement leaders identified
- **Engagement patterns**: Monthly trends visible

---

## 🎯 Portuguese VCs (Pre-configured)

Your workflow already includes 13 companies:
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

**Expected volume:** ~40-50 posts per week from all companies (3-4 posts/week per VC)

---

## 🔍 Testing Checklist

Before going live, verify:

### Backend Tests
- [ ] Webhook health check: `curl http://localhost:3000/api/webhook`
- [ ] Test with sample data: `curl -X POST ... @test-webhook.json`
- [ ] Supabase tables exist (vc_companies, posts, post_categories)

### Frontend Tests
- [ ] Dashboard loads: http://localhost:3000
- [ ] Companies page works: http://localhost:3000/dashboard/companies
- [ ] Insights page shows stats: http://localhost:3000/dashboard/insights
- [ ] Media preview displays post images

### n8n Tests
- [ ] Apify account created & token saved
- [ ] n8n instance running (cloud or local)
- [ ] Workflow imported successfully
- [ ] Company List node shows 13 companies
- [ ] Apify token configured in workflow
- [ ] Webhook URL points to correct endpoint
- [ ] Test workflow runs without errors
- [ ] Posts appear in dashboard after test run

---

## 💰 Costs

### Development (Free)
- Supabase: Free tier
- n8n: Free tier (5,000 executions/month)
- Apify: $5 free credit (~50 runs)

### Production (Cheap)
- Supabase: Free tier (sufficient)
- n8n: Free tier (30 daily runs = well within limit)
- Apify: ~$3-5/month (daily scraping)
- Vercel: Free tier

**Total: $3-5/month** 🎉

---

## 🚨 Common Issues & Solutions

### Issue: Webhook 401 Unauthorized
**Solution:** Check Bearer token in n8n matches `WEBHOOK_SECRET` in `.env.local`

### Issue: No posts appearing
**Causes:**
- LinkedIn URLs incorrect
- Companies have no recent posts
- Posts older than 7 days (dashboard shows last 7 days only)

**Solution:** Check n8n execution logs, verify LinkedIn URLs manually

### Issue: n8n timeout
**Solution:** Increase timeout to 300000 (5 min) in Apify node settings

### Issue: Media images not loading
**Solution:** Check `media.images` array exists in raw post data from Apify

### Issue: Some companies fail to scrape
**Expected:** Normal! Some VCs may have privacy settings or no posts. Workflow continues with others.

### Issue: n8n can't reach localhost webhook
**Solution:** Use ngrok for testing
```bash
ngrok http 3000
# Use ngrok URL in n8n: https://abc123.ngrok.io/api/webhook
```

---

## 📈 Next Steps

### Week 1
- Let workflow run daily
- Monitor n8n executions
- Check dashboard daily

### Week 2
- Review insights page
- Identify top performers
- Adjust categories if needed

### Week 3
- Deploy to production (Vercel)
- Update n8n webhook URL
- Share dashboard with team

### Month 2+
- Add more VC companies
- Analyze trends
- Export data for reports

---

## 📚 Documentation

- **Full n8n setup**: `docs/n8n-setup-guide.md`
- **Webhook details**: `docs/webhook-setup.md`
- **Database schema**: `docs/schema.md`
- **Architecture**: `docs/architecture.md`

---

## 🆘 Need Help?

1. Check troubleshooting in `docs/n8n-setup-guide.md`
2. Review n8n execution logs
3. Test webhook with curl
4. Check Supabase logs

---

## ✨ You're Ready!

Everything is configured and ready to go. Just follow the 6 steps above and you'll have automated LinkedIn monitoring in 30 minutes!

**Start here**: Create your Apify account → https://apify.com/
