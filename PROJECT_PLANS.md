# AIByJob - Project Plans & Roadmap

## Overview
Future enhancements and features planned for AIByJob.

---

## 🔴 High Priority

### Backend API for Real Google Maps Data
**Status:** Planned  
**Effort:** 2-4 hours  
**Files Ready:** `backend/` folder with Flask & Apps Script code

**What's needed:**
1. Get Google Maps API key ($200/mo free credit)
2. Choose deployment: Google Apps Script (free) or Flask on Render/Railway
3. Deploy backend
4. Update `chain-runner.js` to call real API instead of mock data

**Chains affected:**
- 🗺️ Google Maps No-Website Scanner
- 🛒 Retail No-Ecommerce Scanner

**See:** `backend/SETUP.md` for complete instructions

---

## 🟡 Medium Priority

### Real-time Lead Enrichment
- Add LinkedIn company lookup
- Add social media follower counts
- Add estimated revenue from external APIs

### Email Integration
- Connect to Gmail/Outlook for sending pitch emails
- Track email opens/responses
- CRM-style lead management

### User Accounts & Saved Searches
- Save search history per user
- Export to CRM (HubSpot, Salesforce)
- Team sharing features

---

## 🟢 Low Priority / Nice to Have

### Additional Chains
- [ ] Competitor Analysis Chain
- [ ] SEO Audit Chain  
- [ ] Social Media Scheduler Chain
- [ ] Invoice Generator Chain

### UI Enhancements
- [ ] Dark/Light theme toggle
- [ ] Mobile app (PWA)
- [ ] Browser extension for quick scans

### Integrations
- [ ] Zapier/Make.com webhooks
- [ ] Slack notifications
- [ ] Google Sheets export

---

## ✅ Completed

| Feature | Date | Version |
|---------|------|---------|
| Agent Chain Visualizer | Jan 26, 2026 | 1.1.0 |
| 5 Working Chains | Jan 26, 2026 | 1.2.0 |
| Google Maps & Ecom Chains (mock data) | Jan 26, 2026 | 1.3.0 |
| Backend code prepared | Jan 26, 2026 | 1.3.0 |
| Flying papers animation | Jan 26, 2026 | 1.1.0 |

---

## 📊 Effort Estimates

| Task | Time | Dependencies |
|------|------|--------------|
| Get Google API key | 15 min | Google account |
| Deploy Apps Script backend | 30 min | API key |
| Deploy Flask to Render | 1 hour | API key, GitHub |
| Connect frontend to backend | 30 min | Deployed backend |
| Add email sending | 2-3 hours | Gmail API or SMTP |
| Add user accounts | 4-6 hours | Database setup |

---

## 🗓️ Suggested Timeline

**Week 1:** Backend deployment (Google Apps Script)
**Week 2:** Test with real data, refine scoring
**Week 3:** Add email integration
**Week 4:** User feedback & iteration

---

*Last updated: January 26, 2026*
