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
- **Duration**: 30-90 seconds
- **Posts scraped**: 100-200 posts (10 companies × 20 posts)
- **Companies created**: ~10
- **Cost**: ~$0.10

### After 7 Days
- **Posts in database**: 700-1400
- **Dashboard**: Fully populated
- **Insights**: Meaningful analytics
- **Trends**: Category breakdown visible

---

## 🎯 Portuguese VCs (Pre-configured)

Your workflow already includes:
1. Indico Capital Partners
2. Armilar Venture Partners
3. Portugal Ventures
4. Busy Angels
5. Faber Ventures
6. Shilling VC
7. BYND Venture Capital
8. Golden Ventures
9. Maze X
10. Seedrs

---

## 🔍 Testing Checklist

### Test Webhook
```bash
curl http://localhost:3000/api/webhook
# Should return: {"status":"ok","message":"Webhook endpoint is active"}
```

### Test with Sample Data
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 5cd66308c1557f0d56178db6265f7ed5b2a3eda14965367f0dcc53130254787d" \
  -d @test-webhook.json
```

### Check Dashboard
- Open http://localhost:3000
- Should redirect to `/dashboard`
- Click "Companies" - see list
- Click "Insights" - see stats

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

## 🚨 Common Issues

### n8n can't reach localhost webhook
**Solution**: Use ngrok for testing
```bash
ngrok http 3000
# Use ngrok URL in n8n: https://abc123.ngrok.io/api/webhook
```

### Apify returns no data
**Solution**: Check company URLs on LinkedIn manually

### Webhook 401 error
**Solution**: Verify Bearer token matches `WEBHOOK_SECRET`

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
