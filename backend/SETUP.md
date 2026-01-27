# AIByJob Backend Setup Guide

## Overview
This guide covers setting up a backend to call Google Maps Places API for the business finder chains.

---

## 🔑 Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Library**
4. Enable these APIs:
   - **Places API**
   - **Maps JavaScript API** (optional, for map display)
5. Go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **API Key**
7. Copy the API key
8. **IMPORTANT**: Restrict the key:
   - Click on the key
   - Under "Application restrictions": Set to HTTP referrers
   - Add your domains: `localhost:*`, `*.github.io`
   - Under "API restrictions": Restrict to Places API

### API Costs
- Google gives **$200/month free credit**
- Places Text Search: $32 per 1,000 requests
- Place Details: $17 per 1,000 requests
- **Typical usage**: ~50 searches = ~$2.50

---

## 🚀 Option A: Google Apps Script (Easiest)

### Pros
- ✅ 100% Free
- ✅ No server to manage
- ✅ Already in Google ecosystem

### Setup
1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Copy contents of `google-apps-script.js`
4. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your key
5. Click **Deploy** → **New deployment**
6. Select type: **Web app**
7. Set "Who has access" to **Anyone**
8. Copy the deployment URL

### Use in Frontend
```javascript
const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

const response = await fetch(API_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'findNoWebsite',
    location: 'Austin, TX',
    industry: 'restaurants',
    maxResults: 15
  })
});
const data = await response.json();
```

---

## 🐍 Option B: Python Flask (More Control)

### Pros
- ✅ Full control over logic
- ✅ Easy to add features
- ✅ Can run locally for development

### Local Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_MAPS_API_KEY=your_key_here" > .env

# Run
python app.py
```

### Deploy to Render.com (Free)
1. Push backend folder to GitHub
2. Go to [render.com](https://render.com)
3. New → Web Service
4. Connect your repo
5. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
6. Add Environment Variable: `GOOGLE_MAPS_API_KEY`
7. Deploy

### Deploy to Railway.app (Free)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Add Variable: `GOOGLE_MAPS_API_KEY`
5. Railway auto-detects Python

### Use in Frontend
```javascript
const API_URL = 'https://your-app.onrender.com'; // or railway URL

const response = await fetch(`${API_URL}/api/find-no-website`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'Austin, TX',
    industry: 'restaurants',
    maxResults: 15
  })
});
const data = await response.json();
```

---

## ⚡ Option C: Vercel Serverless Functions

### Pros
- ✅ Deploys with your frontend
- ✅ Pay per use
- ✅ Auto-scaling

### Setup
1. Create `api` folder in your project root
2. Create `api/find-businesses.js`:

```javascript
// api/find-businesses.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location, industry, maxResults } = req.body;
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  // Call Google Places API
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(industry + ' in ' + location)}&key=${API_KEY}`;
  
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  
  // Process and return results...
  res.json({ businesses: searchData.results });
}
```

3. Add `GOOGLE_MAPS_API_KEY` to Vercel environment variables
4. Deploy: `vercel deploy`

---

## 🔧 Integrating with AIByJob Frontend

Update `chain-runner.js` to use real API:

```javascript
// Add to ChainRunner object
apiUrl: 'https://your-api-url.com', // Set this to your backend URL

async runGoogleMapsScanner(input, onProgress) {
  const { location, industry, resultCount } = input;
  
  onProgress('search', 'active', `Searching Google Maps...`);
  
  try {
    const response = await fetch(`${this.apiUrl}/api/find-no-website`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, industry, maxResults: resultCount })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    onProgress('search', 'complete', `Found ${data.totalFound} businesses`);
    
    // Continue with rest of chain...
    return data;
    
  } catch (error) {
    onProgress('search', 'error', error.message);
    throw error;
  }
}
```

---

## 🔒 Security Best Practices

1. **Never expose API key in frontend code**
   - Always call through your backend
   - Backend keeps the key secret

2. **Restrict API key in Google Console**
   - Limit to specific APIs
   - Limit to specific domains/IPs

3. **Add rate limiting to your backend**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app, default_limits=["100 per day"])
   ```

4. **Monitor usage in Google Console**
   - Set up billing alerts
   - Review usage regularly

---

## 📊 Testing

### Test Google Apps Script
1. In script editor, run `testSearch()` function
2. View → Logs to see results

### Test Flask API
```bash
# Health check
curl http://localhost:5000/

# Search test
curl -X POST http://localhost:5000/api/find-no-website \
  -H "Content-Type: application/json" \
  -d '{"location":"Austin, TX","industry":"restaurants","maxResults":5}'
```

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| `REQUEST_DENIED` | API key invalid or Places API not enabled |
| `OVER_QUERY_LIMIT` | Hit rate limit, add delays between requests |
| `ZERO_RESULTS` | Try different search terms or location |
| `CORS error` | Backend needs CORS headers (Flask-CORS) |
| `Timeout` | Increase timeout in requests, check API key restrictions |

---

## 📁 File Structure

```
backend/
├── app.py                    # Python Flask API
├── requirements.txt          # Python dependencies
├── google-apps-script.js     # Google Apps Script version
├── .env                      # Environment variables (create this)
└── SETUP.md                  # This file
```

---

## Next Steps

1. Choose your backend option
2. Get Google Maps API key
3. Deploy backend
4. Update frontend to use real API
5. Test thoroughly
6. Monitor usage/costs

Questions? The Python Flask option gives you the most flexibility for adding features later.
