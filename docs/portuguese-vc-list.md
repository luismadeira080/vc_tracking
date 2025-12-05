# Portuguese VC Companies - Complete List

This document lists all 13 Portuguese venture capital firms configured in your n8n workflow.

---

## 📋 Complete List

| # | Company Name | LinkedIn URL | Slug |
|---|--------------|--------------|------|
| 1 | Indico Capital Partners | [Link](https://www.linkedin.com/company/indico-capital-partners) | `indico-capital-partners` |
| 2 | Crest Capital Partners | [Link](https://www.linkedin.com/company/crest-capital-partners) | `crest-capital-partners` |
| 3 | Oxy Capital | [Link](https://www.linkedin.com/company/oxy-capital) | `oxy-capital` |
| 4 | BlueCrow | [Link](https://www.linkedin.com/company/bluecrow) | `bluecrow` |
| 5 | Shilling VC | [Link](https://www.linkedin.com/company/shilling-vc) | `shilling-vc` |
| 6 | Portugal Ventures | [Link](https://www.linkedin.com/company/portugal-ventures) | `portugal-ventures` |
| 7 | Armilar Venture Partners | [Link](https://www.linkedin.com/company/armilar-venture-partners) | `armilar-venture-partners` |
| 8 | Bynd Venture Capital | [Link](https://www.linkedin.com/company/bynd-venture-capital) | `bynd-venture-capital` |
| 9 | Iberis Capital | [Link](https://www.linkedin.com/company/iberis-capital) | `iberis-capital` |
| 10 | Lince Capital | [Link](https://www.linkedin.com/company/lince-capital) | `lince-capital` |
| 11 | Explorer Investments | [Link](https://www.linkedin.com/company/explorer-investments) | `explorer-investments` |
| 12 | Draycott | [Link](https://www.linkedin.com/company/draycott) | `draycott` |
| 13 | Faber | [Link](https://www.linkedin.com/company/faber-ventures) | `faber-ventures` |

---

## 🔍 How to Verify LinkedIn URLs

Before running the workflow, verify each URL manually:

1. Click the LinkedIn link
2. Confirm it's the correct company page
3. Check that they have recent posts (last 30 days)
4. Verify "Posts" tab is accessible

**Note**: Some companies may have privacy settings that prevent scraping.

---

## 📊 Expected Data Volume

### Per Daily Run (13 companies × 20 posts each)
- **Maximum posts**: 260
- **Realistic posts**: 150-200 (some companies post less frequently)
- **Execution time**: ~10-12 minutes
- **Cost per run**: ~$0.15-0.25

### Per Month (30 runs)
- **Total posts**: 4,500-6,000
- **Monthly cost**: ~$5-8

---

## 🎯 Company Categories (for analysis)

### Large/Institutional (5)
- Portugal Ventures (government-backed)
- Armilar Venture Partners
- Indico Capital Partners
- Bynd Venture Capital
- Faber

### Mid-Size (5)
- Shilling VC
- Crest Capital Partners
- Oxy Capital
- Iberis Capital
- Lince Capital

### Boutique/Specialized (3)
- BlueCrow
- Explorer Investments
- Draycott

---

## 🔧 Adding More Companies

To add new companies to the workflow:

### Step 1: Find LinkedIn URL
Example: `https://www.linkedin.com/company/new-vc-name`

### Step 2: Update n8n Workflow

Edit **Node 2: Company List** in `n8n-workflow-improved.json`:

```javascript
const companies = [
  // Existing companies...

  // Add new company:
  {
    url: "https://www.linkedin.com/company/new-vc-name",
    name: "New VC Name"
  }
];
```

### Step 3: Test First

Run workflow manually to test the new company before scheduling.

---

## 🚨 Troubleshooting by Company

### If a company returns no posts:

**Check:**
1. LinkedIn URL is correct
2. Company has posted in last 30 days
3. Company page is public (not private)
4. LinkedIn URL format is exact (no trailing slashes)

**Common issues:**
- **Wrong URL**: `company/name` vs `company/name-ventures`
- **Private profile**: Some VCs restrict visibility
- **Inactive**: Company hasn't posted in months

---

## 📈 Post Activity Expectations

Based on typical VC LinkedIn activity:

### High Activity (>15 posts/month)
- Portugal Ventures
- Indico Capital Partners
- Shilling VC
- Armilar Venture Partners

### Medium Activity (5-15 posts/month)
- Bynd Venture Capital
- Faber
- Crest Capital Partners
- BlueCrow

### Low Activity (<5 posts/month)
- Smaller funds
- Newer VCs
- Boutique firms

**Note**: Activity may vary by season (higher during conference season, funding announcements)

---

## 🌐 Alternative Company Identifiers

Some companies may have multiple LinkedIn presence:

| Company | Main Page | Alternative |
|---------|-----------|-------------|
| Faber | faber-ventures | faber-capital |
| Explorer | explorer-investments | explorer-vc |

If scraping fails, try alternative URLs.

---

## 💡 Best Practices

### 1. Start Small
- Begin with 5 companies
- Verify data quality
- Expand to all 13 after testing

### 2. Monitor Activity
- Check which companies post most
- Consider removing inactive companies
- Focus on high-value sources

### 3. Regular Updates
- Quarterly review of company list
- Check for new Portuguese VCs
- Update LinkedIn URLs if changed

### 4. Backup List
Keep this list updated as companies:
- Rebrand (URL changes)
- Merge (combine pages)
- Go inactive (stop posting)

---

## 📝 Notes

- **BlueCrow**: Sometimes spelled "Blue Crow" - verify URL
- **Draycott**: May have limited LinkedIn presence
- **Explorer Investments**: Check if "explorer-ventures" is alternative
- **Faber**: Using "faber-ventures" slug (full name)

---

## 🔄 Workflow Integration

This list is automatically used by:
- `n8n-workflow-improved.json` → Company List node
- Webhook → Auto-creates companies in database
- Dashboard → Displays company names and slugs

**When you run the workflow, all 13 companies will be:**
1. Scraped for recent posts
2. Auto-created in `vc_companies` table
3. Visible in `/dashboard/companies`
4. Searchable and filterable

---

## ✅ Verification Checklist

Before running your first workflow:

- [ ] All 13 LinkedIn URLs tested manually
- [ ] Each company has visible posts
- [ ] n8n workflow imported
- [ ] Company List node shows 13 companies
- [ ] Webhook URL updated (localhost or production)
- [ ] Apify API token configured

---

**Your workflow is now configured with all 13 Portuguese VC firms! 🇵🇹**

Next: Import `n8n-workflow-improved.json` to n8n and test it.
