# AIByJob - UA Test Plan

## Site Information
| Field | Value |
|-------|-------|
| **Site Name** | AIByJob |
| **Repository** | aibyjob-demo |
| **Live URL** | https://aiunites.github.io/aibyjob-demo/ |
| **Local Path** | C:/Users/Tom/Documents/GitHub/aibyjob-demo |
| **Last Updated** | January 24, 2026 |
| **Version** | 1.0.0 |
| **Based On** | DemoTemplate |
| **Tagline** | The Right AI for Your Job |

---

## Pages Inventory

| Page | File | Description | Status |
|------|------|-------------|--------|
| Main App | index.html | All screens (SPA) | ✅ Active |
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
| My Tools | my-items-view | ✅ |
| 🤖 Agents | agents-view | ✅ |
| Discover | discover-view | ✅ |
| Favorites | favorites-view | ✅ |

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
| cloud-database.js | Cloud sync module | ✅ |

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

---

## Known Issues / TODO

| Issue | Priority | Status |
|-------|----------|--------|
| Configure CloudDB form submission | Medium | 🔲 TODO |
| Add real agent API integration | Low | 🔲 Future |
| Add more agent templates | Low | 🔲 Future |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release with agents |
| 1.0.1 | Jan 24, 2026 | Added CloudDB module |

---

*Last tested: January 24, 2026*
