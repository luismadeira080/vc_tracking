# n8n Workflow Explained

## Why Two Workflow Options?

### Option 1: Simple Workflow (`n8n-workflow.json`)
**Pros:**
- ✅ Simpler (3 nodes)
- ✅ Faster (all companies scraped in parallel)
- ✅ Easier to understand

**Cons:**
- ❌ Apify LinkedIn scraper processes one company at a time
- ❌ May hit rate limits
- ❌ If one company fails, entire batch fails

**Use when:** Testing or scraping 1-3 companies

---

### Option 2: Improved Workflow (`n8n-workflow-improved.json`) ⭐ **RECOMMENDED**
**Pros:**
- ✅ Processes one company at a time (reliable)
- ✅ If one company fails, others continue
- ✅ Better error handling and logging
- ✅ Respects rate limits
- ✅ Can track progress per company

**Cons:**
- ❌ Takes longer (sequential processing)
- ❌ Slightly more complex (7 nodes)

**Use when:** Production with 5+ companies

---

## Improved Workflow Architecture

```
┌─────────────┐
│  Schedule   │  Trigger: Daily at 9am
│  Trigger    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Company    │  Output: Array of 10 companies
│    List     │  [{url: "...", name: "Indico"}, ...]
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Split in   │  Process: One company at a time
│   Batches   │  Loop: 10 iterations
└──────┬──────┘
       │
       ↓ (Loop starts)
┌─────────────┐
│   Apify     │  Scrape: Current company
│  Scraper    │  Returns: Array of posts (0-20)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Check If  │  Condition: Posts array not empty?
│Posts Found  │
└──┬────────┬─┘
   │        │
   YES      NO
   │        │
   ↓        ↓
┌──────┐ ┌─────────┐
│Webhook│ │Log "No  │
│       │ │Posts"   │
└───┬───┘ └────┬────┘
    │          │
    └────┬─────┘
         │
         ↓
    (Loop back to Split in Batches for next company)
```

---

## Node-by-Node Breakdown

### Node 1: Schedule Trigger
**Purpose**: Start workflow automatically

**Configuration:**
```
Cron: 0 9 * * *  (Every day at 9am)
```

**Output:**
```json
{
  "timestamp": "2025-12-03T09:00:00Z"
}
```

---

### Node 2: Company List (Code Node)
**Purpose**: Define which VCs to scrape

**Code:**
```javascript
const companies = [
  { url: "https://www.linkedin.com/company/indico-capital-partners", name: "Indico Capital" },
  { url: "https://www.linkedin.com/company/armilar-venture-partners", name: "Armilar" },
  // ... more companies
];

return companies.map(company => ({ json: company }));
```

**Output:**
```json
[
  { "url": "https://...", "name": "Indico Capital" },
  { "url": "https://...", "name": "Armilar" },
  ...
]
```

**To modify:** Edit the JavaScript array to add/remove companies

---

### Node 3: Split in Batches
**Purpose**: Process companies one at a time

**Configuration:**
```
Batch Size: 1 (process one company per iteration)
```

**How it works:**
1. Takes array of 10 companies
2. Sends company #1 to next node
3. Waits for processing to complete
4. Sends company #2, and so on...
5. Loops back until all companies processed

---

### Node 4: Apify Scraper (Per Company)
**Purpose**: Scrape LinkedIn posts for current company

**Configuration:**
```json
{
  "startUrls": [{ "url": "{{ $json.url }}" }],  // Current company URL
  "maxPosts": 20,
  "scrapePostStats": true
}
```

**Key settings:**
- `continueOnFail: true` - If scraping fails, workflow continues
- `timeout: 180000` - 3 minute timeout per company

**Output:**
```json
[
  {
    "activity_urn": "urn:li:activity:...",
    "text": "Excited to announce...",
    "author": { "name": "Indico Capital Partners" },
    "stats": { "total_reactions": 150 }
  },
  // ... more posts (0-20)
]
```

---

### Node 5: Check If Posts Found
**Purpose**: Handle empty results gracefully

**Condition:**
```
IF: $json is not empty
THEN: Send to webhook
ELSE: Log "no posts"
```

**Why?**
- Some companies may have no recent posts
- Prevents sending empty data to webhook
- Avoids unnecessary API calls

---

### Node 6A: Send to Webhook (If posts found)
**Purpose**: Store posts in database

**Configuration:**
```
URL: http://localhost:3000/api/webhook
Method: POST
Headers: Authorization: Bearer YOUR_SECRET
Body: { "posts": $json }
```

**Response:**
```json
{
  "message": "Webhook processed",
  "results": {
    "success": 18,
    "failed": 0,
    "skipped": 2,
    "errors": []
  }
}
```

**After:** Loop back to Node 3 for next company

---

### Node 6B: Log No Posts (If no posts)
**Purpose**: Track companies with no activity

**Code:**
```javascript
const companyUrl = $input.first().json.url;
console.log(`No posts found for: ${companyUrl}`);
return [];
```

**Why useful:**
- See which companies are inactive
- Helps identify URLs that need updating
- Visible in n8n execution logs

**After:** Loop back to Node 3 for next company

---

## Execution Flow Example

**Starting with 3 companies:**

```
Iteration 1: Indico Capital
  → Apify: Found 18 posts
  → Webhook: Stored 18 posts
  → Loop back

Iteration 2: Armilar Ventures
  → Apify: Found 12 posts
  → Webhook: Stored 12 posts
  → Loop back

Iteration 3: Portugal Ventures
  → Apify: Found 0 posts
  → Log: "No posts found for Portugal Ventures"
  → Loop back

All iterations complete → Workflow ends
```

**Total time:** ~3-5 minutes (60 seconds per company average)

---

## Timing & Performance

### Per Company
- Apify scraping: 30-60 seconds
- Webhook processing: 5-10 seconds
- **Total: ~45 seconds per company**

### Full Workflow (10 companies)
- Best case: 5 minutes (all succeed quickly)
- Average: 7-8 minutes
- Worst case: 15 minutes (some timeouts)

### Daily Schedule
```
09:00 - Workflow starts
09:08 - Workflow completes (average)
09:10 - Dashboard shows fresh data
```

---

## Error Handling

### Company Scraping Fails
**What happens:**
- Apify returns error
- `continueOnFail: true` → Workflow continues
- Logs error message
- Moves to next company

**Result:** 9 other companies still get processed ✅

### Webhook Fails
**What happens:**
- HTTP request error
- Posts for that company not stored
- Logs error
- Moves to next company

**Result:** Other companies still get stored ✅

### Rate Limiting
**What happens:**
- Apify returns 429 error
- Scraping paused automatically
- Retries after delay

**Prevention:** Sequential processing respects limits

---

## Cost Breakdown

### Per Company
- Apify cost: ~$0.01-0.02
- n8n execution: Free (within tier)

### Daily Run (10 companies)
- Apify: $0.10-0.20
- n8n: Free

### Monthly (30 days)
- Apify: $3-6
- n8n: Free (30 executions << 5,000 limit)

**Total: $3-6/month** for automated tracking 🎉

---

## Advantages Over Simple Workflow

| Feature | Simple | Improved |
|---------|--------|----------|
| Reliability | ⚠️ Fair | ✅ Excellent |
| Error recovery | ❌ No | ✅ Yes |
| Progress tracking | ❌ No | ✅ Yes |
| Rate limit safe | ⚠️ Maybe | ✅ Always |
| Debugging | ⚠️ Hard | ✅ Easy |
| Scalability | ❌ Limited | ✅ Unlimited |
| Total time | ⚡ Fast | 🐢 Slower |

---

## When to Use Each

### Use Simple Workflow If:
- Testing the setup
- Scraping 1-3 companies only
- Speed is critical
- Comfortable with "all or nothing" approach

### Use Improved Workflow If: ⭐
- Production environment
- Scraping 5+ companies
- Need reliability
- Want detailed logging
- Care about all companies getting processed

---

## Customization

### Add More Companies
Edit Node 2 (Company List):
```javascript
const companies = [
  // Add new entries here
  { url: "https://linkedin.com/company/new-vc", name: "New VC" }
];
```

### Change Posts Per Company
Edit Node 4 (Apify Scraper):
```json
"maxPosts": 30  // Increase from 20
```

### Change Schedule
Edit Node 1 (Schedule Trigger):
```
Twice daily: 0 9,21 * * *
Every 6 hours: 0 */6 * * *
Weekly: 0 9 * * 1
```

---

## Monitoring & Debugging

### Check Execution Logs
1. n8n → Executions
2. Click execution
3. See each node's input/output
4. Check "Log No Posts" for inactive companies

### Common Issues

**Issue: "Timeout error"**
- Solution: Increase timeout in Node 4 to 300000 (5 min)

**Issue: "No posts for any company"**
- Solution: Check LinkedIn URLs are correct
- Verify companies have recent posts

**Issue: "Webhook 401 error"**
- Solution: Check Bearer token matches

---

## Summary

The improved workflow is **more robust** because:
1. ✅ Processes sequentially (one at a time)
2. ✅ Handles failures gracefully
3. ✅ Provides detailed logging
4. ✅ Respects rate limits
5. ✅ Easier to debug

**Recommendation:** Use `n8n-workflow-improved.json` for production! 🚀
