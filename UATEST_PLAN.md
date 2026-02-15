# AIByJob - UA Test Plan

## Site Information
| Field | Value |
|-------|-------|
| **Site Name** | AIByJob |
| **Repository** | aibyjob-demo |
| **Live URL** | https://aiunites.github.io/aibyjob-demo/ |
| **Local Path** | C:/Users/Tom/Documents/GitHub/aibyjob-demo |
| **Last Updated** | January 27, 2026 |
| **Version** | 1.4.0 |
| **Based On** | DemoTemplate |
| **Tagline** | The Right AI for Your Job |

---

## Pages Inventory

| Page | File | Description | Status |
|------|------|-------------|--------|
| Main App | index.html | All screens (SPA) | ✅ Active |
| Help Center | help.html | FAQ, guides, support | ✅ Active |
| Agent Templates | agents/templates/index.html | Browse agent templates | ✅ Active |
| Lead Qualification | agents/templates/lead-qualification.html | Lead qual template | ✅ Active |

---

## Screens (In index.html)

| Screen | ID | Description | Status |
|--------|-----|-------------|--------|
| Landing | landing-screen | Hero, features, agents demo, CTA | ✅ |
| Auth | auth-screen | Login/Signup forms | ✅ |
| Dashboard | dashboard-screen | My Tools, Agents, Discover, Favorites | ✅ |

---

## Core Features (Inherited from DemoTemplate)

### 🔐 Authentication System
| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ | |
| User Login | ✅ | |
| Demo Mode Login | ✅ | |
| Logout | ✅ | |
| First User = Admin | ✅ | |
| Auto-create Demo Users | ✅ | |
| Terms/Privacy Agreement | ✅ | |
| Reset App Link | ✅ | |

### 👤 User Dropdown Menu
| Feature | Status | Notes |
|---------|--------|-------|
| Click to Toggle | ✅ | |
| Admin Panel Link | ✅ | |
| Settings Link | ✅ | |
| Logout Link | ✅ | |

### ⚙️ Settings Modal
| Feature | Status | Notes |
|---------|--------|-------|
| Edit Display Name | ✅ | |
| Edit Email | ✅ | |
| Backup & Restore | ✅ | |
| View My Cache | ✅ | |
| Legal Links | ✅ | |

### 🗄️ Cache Viewer Modal
| Feature | Status | Notes |
|---------|--------|-------|
| Summary Tab | ✅ | Tools count |
| Items Tab | ✅ | My Tools list |
| Raw Data Tab | ✅ | |
| Clear My Data | ✅ | |

### 🛡️ Admin Panel Modal
| Feature | Status | Notes |
|---------|--------|-------|
| System Settings Tab | ✅ | Toggles, limits |
| Users Tab | ✅ | User list |
| Statistics Tab | ✅ | Total users, tools |
| Analytics Tab | ✅ | Charts and metrics |
| Data Sources Tab | ✅ | Manage data sources |
| SQL Database Tab | ✅ | Query browser database |
| Cloud Tab | ✅ | Cloud sync settings |
| Project Plans Tab | ✅ | Roadmap & priorities |
| Changelog Tab | ✅ | |

### 📜 Legal Modal
| Feature | Status | Notes |
|---------|--------|-------|
| Terms of Service | ✅ | |
| Privacy Policy | ✅ | |

---

## AIByJob-Specific Features

### 🎯 Landing Page
| Feature | Status | Notes |
|---------|--------|-------|
| Hero with Tool Cards | ✅ | Finance, Healthcare, Developers |
| Demo Badge | ✅ | Pre-launch indicator |
| Features Grid | ✅ | 3 feature cards |
| **AI Agents Showcase** | ✅ | Interactive demo terminal |
| Agent Selection Sidebar | ✅ | 4 agents |
| Quick Commands | ✅ | Pre-set tasks |
| Live Terminal Output | ✅ | Simulated agent output |
| Results Preview | ✅ | Visual output area |
| AI Tools Grid | ✅ | Sample tools |
| Waitlist CTA | ✅ | Join waitlist button |

### 🤖 AI Agents Hub (Dashboard)
| Feature | Status | Notes |
|---------|--------|-------|
| Agents Grid | ✅ | 4 agent cards |
| **WebBuilder Agent** | ✅ | Website creation |
| **MarketingPro Agent** | ✅ | Digital marketing (Popular tag) |
| **LeadFinder Agent** | ✅ | Business discovery |
| **EcomScout Agent** | ✅ | E-commerce opportunities |
| Agent Cards | ✅ | Icon, status, version, capabilities |
| Launch Agent Button | ✅ | Opens workspace modal |
| Templates Link | ✅ | Browse templates |

### 🖥️ Agent Workspace Modal
| Feature | Status | Notes |
|---------|--------|-------|
| Agent Form Panel | ✅ | Dynamic form |
| Run Agent Button | ✅ | Execute agent |
| Agent Terminal Output | ✅ | Simulated output |
| Results Preview | ✅ | Visual results |

### 🛠️ My Tools (Dashboard)
| Feature | Status | Notes |
|---------|--------|-------|
| Tools Grid | ✅ | User's saved tools |
| Add Tool Button | ✅ | Create modal |
| Empty State | ✅ | First tool prompt |
| Stats Row | ✅ | Tool statistics |

### 🔍 Discover View
| Feature | Status | Notes |
|---------|--------|-------|
| Popular Tools Grid | ✅ | Community tools |
| Tool Cards | ✅ | Icon, name, description |

### ⭐ Favorites View
| Feature | Status | Notes |
|---------|--------|-------|
| Saved Tools | ✅ | User's favorites |
| Empty State | ✅ | No favorites message |

### 📦 Tool Management
| Feature | Status | Notes |
|---------|--------|-------|
| Create Tool Modal | ✅ | Dynamic form |
| Edit Tool | ✅ | Pre-filled form |
| Delete Tool | ✅ | With confirmation |
| View Tool Detail | ✅ | Modal |
| Favorite Toggle | ✅ | Star button |

---

## Dashboard Navigation

| Tab | View ID | Status |
|-----|---------|--------|
| 🤖 Agents | agents-view | ✅ |
| 📋 Templates | templates-view | ✅ |
| 🎬 Director | control-view | ✅ |
| My Tools | my-items-view | ✅ |
| Discover | discover-view | ✅ |

### 🎬 AI Director (Control Center)
| Feature | Status | Notes |
|---------|--------|-------|
| Stats Row | ✅ | Agents, Tasks, Posts, Leads counts |
| Quick Launch Buttons | ✅ | Promotion, LeadFinder, WebBuilder, Marketing |
| **Agent Chain Visualizer** | ✅ | Interactive animated demo |
| Chain Selector | ✅ | 7 working chains to choose from |
| Visual Chain Flow | ✅ | Animated agent nodes with progress |
| Data Packet Animation | ✅ | Flying papers between agents |
| Input Forms | ✅ | Dynamic forms per chain type |
| Output Log | ✅ | Real-time status updates |
| Results Panel | ✅ | Tabbed output with copy buttons |
| New Chain Builder | ✅ | Modal to create custom chains |
| Agent Status Grid | ✅ | Online/Offline status for all agents |
| Task History | ✅ | List of completed tasks |
| Export CSV | ✅ | Download history as CSV |
| Export JSON | ✅ | Download history as JSON |

### 🔗 Working Agent Chains
| Chain | Description | Status |
|-------|-------------|--------|
| 📱 Social Media Blitz | One input → LinkedIn + Twitter + Facebook | ✅ |
| 🚀 AIUNITES Site Launcher | Generate social kit for any AIUNITES site | ✅ |
| 📧 Lead-to-Email Pipeline | Find leads → Score → Generate emails | ✅ |
| ♻️ Content Repurposer | Article → Summary + Social + Newsletter | ✅ |
| 🎯 Product Launch Kit | Brief → Landing + Social + Press + Email | ✅ |
| 🗺️ Google Maps No-Website | Find businesses without websites | ✅ |
| 🛒 Retail No-Ecommerce | Find shops without online stores | ✅ |

---

## Agent Templates (agents/templates/)

| Template | File | Status |
|----------|------|--------|
| Templates Index | index.html | ✅ |
| Lead Qualification | lead-qualification.html | ✅ |

---

## Cloud Integration

| Feature | Status | Notes |
|---------|--------|-------|
| CloudDB Module | ✅ | js/cloud-database.js |
| Script Tag Added | ✅ | In index.html |
| Form Submission | ⬜ | Not configured |
| API Fetch | ⬜ | Not configured |

---

## JavaScript Files

| File | Purpose | Status |
|------|---------|--------|
| config.js | App configuration | ✅ |
| storage.js | localStorage wrapper | ✅ |
| auth.js | Authentication logic | ✅ |
| app.js | Main app logic | ✅ |
| agents.js | AI agents logic | ✅ |
| control-center.js | AI Director logic | ✅ |
| chain-visualizer.js | Animated chain demo | ✅ |
| chain-runner.js | Chain execution engine | ✅ |
| analytics.js | Analytics panel | ✅ |
| datasource.js | Data source manager | ✅ |
| sql-database.js | SQL database panel | ✅ |
| cloud-database.js | Cloud sync module | ✅ |
| project-plans.js | Project roadmap module | ✅ |

### Backend Files (backend/)
| File | Purpose | Status |
|------|---------|--------|
| app.py | Python Flask API | ✅ |
| google-apps-script.js | Google Apps Script API | ✅ |
| requirements.txt | Python dependencies | ✅ |
| SETUP.md | Backend setup guide | ✅ |
| .env.example | Environment template | ✅ |

---

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `aibyjob_users` | All user accounts |
| `aibyjob_currentUser` | Logged in user |
| `aibyjob_items` | All tools |
| `aibyjob_favorites_[userId]` | User's favorites |

---

## Test Scenarios

### Landing Page Tests
- [ ] Hero loads with tool cards
- [ ] AI Agents demo terminal works
- [ ] Agent selection changes terminal title
- [ ] Quick commands trigger output
- [ ] Get Started redirects to auth
- [ ] Try Demo logs in as demo
- [ ] Try AI Agents scrolls to agents section

### Authentication Tests
- [ ] Signup creates user
- [ ] Login validates credentials
- [ ] Demo login works
- [ ] Logout clears session

### Dashboard Tests
- [ ] My Tools tab shows user's tools
- [ ] Agents tab shows 4 agent cards
- [ ] Discover tab shows community tools
- [ ] Favorites tab shows saved items
- [ ] User dropdown works

### Agent Tests
- [ ] WebBuilder agent card displays
- [ ] MarketingPro shows Popular tag
- [ ] Launch Agent opens workspace modal
- [ ] Run Agent shows terminal output
- [ ] Templates link opens templates page

### Modal Tests
- [ ] Settings modal opens
- [ ] Backup downloads JSON
- [ ] Restore imports data
- [ ] Cache viewer shows data
- [ ] Admin panel works (admin only)
- [ ] Agent workspace modal works
- [ ] Create/Edit tool modal works

### AI Director Tests
- [ ] Director tab shows control view
- [ ] Stats row displays counts
- [ ] Quick launch buttons work
- [ ] Chain visualizer renders
- [ ] Chain selector switches chains (7 chains)
- [ ] Input forms update per chain type
- [ ] Run Chain executes with animations
- [ ] Flying papers animate between agents
- [ ] Progress bars fill during agent work
- [ ] Output log shows status updates
- [ ] Results panel appears after completion
- [ ] Tabbed results display correctly
- [ ] Copy buttons work for each section
- [ ] Copy All exports complete results
- [ ] Social Media Blitz generates 3 platform posts
- [ ] Site Launcher generates social kit + press kit
- [ ] Lead-to-Email generates leads + personalized emails
- [ ] Content Repurposer creates 4 content formats
- [ ] Product Launch Kit creates full launch materials
- [ ] Google Maps Scanner finds businesses without websites
- [ ] Google Maps Scanner generates pitch emails
- [ ] E-commerce Scanner finds stores without online stores
- [ ] E-commerce Scanner generates proposals
- [ ] CSV export buttons work for lead lists
- [ ] Agent status grid shows online/offline
- [ ] New Chain button opens builder modal

### Help & AI Chat Tests
- [ ] Help link in nav goes to help.html
- [ ] Help page loads with all sections
- [ ] Getting Started steps display
- [ ] Agent guide cards show all agents
- [ ] Token guide box links to GitHub
- [ ] FAQ items expand/collapse
- [ ] Ask a Question form submits
- [ ] Quick links work
- [ ] AI Chat toggle button visible
- [ ] AI Chat opens on click
- [ ] Quick question buttons work
- [ ] Chat responds to questions
- [ ] Typing indicator animates
- [ ] Chat closes with X button

---

## Known Issues / TODO

| Issue | Priority | Status |
|-------|----------|--------|
| Configure CloudDB form submission | Medium | 🔲 TODO |
| Add real agent API integration | Low | 🔲 Future |
| Add more agent templates | Low | 🔲 Future |

---

## Legal Compliance Tests
- [ ] Single footer displayed (no duplicates)
- [ ] Footer disclaimer text visible
- [ ] Footer copyright with AIUNITES link
- [ ] Privacy Policy link → aiunites-site/legal.html#privacy
- [ ] Terms of Service link → aiunites-site/legal.html#terms
- [ ] Signup form Terms/Privacy links open legal.html in new tab

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.5.0 | Feb 15, 2026 | Legal compliance: centralized legal.html, removed dup footer, updated all legal links |
| 1.0.0 | Jan 2026 | Initial release with agents |
| 1.0.1 | Jan 24, 2026 | Added CloudDB module |
| 1.1.0 | Jan 26, 2026 | Added Agent Chain Visualizer with animated demos |
| 1.2.0 | Jan 26, 2026 | Added 5 working agent chains with real outputs |
| 1.3.0 | Jan 26, 2026 | Added Google Maps Scanner & E-commerce Scanner chains |
| 1.3.1 | Jan 26, 2026 | Added Project Plans tab to Admin Panel |
| 1.4.0 | Jan 27, 2026 | Added Help page, AI Chat widget, WebBuilder v3 with GitHub deploy |
| 1.5.0 | Feb 15, 2026 | Legal compliance: centralized legal.html, removed dup footer, updated all legal links |

---

*Last tested: February 15, 2026*
