# SahAI - Complete Setup & Testing Guide

## 📊 Build Summary

| Component | Status | Lines | Notes |
|-----------|--------|-------|-------|
| **Backend (FastAPI)** | ✅ Complete | ~1200 | 9 services, 2 routes, DB models |
| **Frontend (React)** | ✅ Complete | ~2000 | 5 pages, routing, i18n, API client |
| **Configuration** | ✅ Complete | ~100 | Settings, crisis keywords (empty), env |
| **Documentation** | ✅ Complete | ~400 | README, guides, comments |
| **Total** | ✅ Ready | ~3700 | Full-stack, production-grade prototype |

---

## 🚀 Installation & Setup

### Step 1: Backend Setup (Python)

```bash
# Navigate to backend
cd E:\Projects\sih1\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies (already done, but verify)
pip install -r requirements.txt
```

**Expected output:** All packages installed successfully (fastapi, uvicorn, sqlalchemy, etc.)

### Step 2: Frontend Setup (Node.js)

```bash
# Navigate to frontend
cd E:\Projects\sih1\frontend

# Install dependencies (already done, but verify)
npm install --legacy-peer-deps

# Verify Tailwind config exists
ls tailwind.config.js
```

**Expected output:** `tailwind.config.js` present, node_modules/ folder created

---

## 🎬 Running the Application

### Terminal 1: Start Backend Server

```bash
cd E:\Projects\sih1\backend

# Activate venv if not already activated
venv\Scripts\activate

# Start FastAPI server
python -m uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ **Backend is ready at:** `http://localhost:8000`  
✅ **API docs available at:** `http://localhost:8000/docs`

### Terminal 2: Start Frontend Dev Server

```bash
cd E:\Projects\sih1\frontend

# Start React dev server
npm run dev
```

**Expected output:**
```
  VITE v... ready in ... ms
  ➜  Local:   http://localhost:5173/
```

✅ **Frontend is ready at:** `http://localhost:5173`

---

## 🧪 Complete E2E Testing Flow

### Pre-Test Verification

1. **Backend health check:**
   ```bash
   curl http://localhost:8000/api/health
   ```
   Expected: `{"status":"ok","service":"sahai-intake"}`

2. **Frontend loads:**
   - Open `http://localhost:5173` in browser
   - Should see landing page with SahAI logo, headline, CTAs

### Test Sequence

#### Test 1: Landing Page
- [ ] Logo + "SahAI" wordmark visible top-left
- [ ] Headline: "Real-time Stress Assessment for Trauma Survivors" (with "Assessment" in blue)
- [ ] Eyebrow: "// built for 14566 · nhaa"
- [ ] Description paragraph visible
- [ ] Two CTAs: "Start Assessment" (blue) + "View Dashboard" (outline)
- [ ] Social proof: "• Smart India Hackathon prototype for NHAA 14566"
- [ ] Mock UI card on right showing live assessment with SVI bar
- [ ] Sticky note accent with "Built for real people. Real support."
- [ ] Language toggle (English/हिन्दी) in navbar
- [ ] Footer disclaimer present

#### Test 2: Consent Screen
- [ ] Click "Start Assessment"
- [ ] Navigate to `/consent`
- [ ] Title: "Before We Begin"
- [ ] Privacy points listed (4 checkmarks)
- [ ] Disclaimer about decision-support tool
- [ ] "I understand and consent" checkbox
- [ ] Language toggle visible
- [ ] "Proceed to Assessment" button (disabled until checkbox ticked)
- [ ] Footer disclaimer visible

**Action:** Check the consent checkbox, then click "Proceed to Assessment"

#### Test 3: Intake Flow
- [ ] Navigate to `/intake`
- [ ] Title: "Tell Us What's Happening"
- [ ] Textarea with placeholder text
- [ ] Character counter (should show "Characters: 0")
- [ ] "Record Voice Note" button (placeholder, can click but no recording)
- [ ] "Submit Assessment" button
- [ ] Footer disclaimer visible

**Action:** Enter test text:
```
I am very scared and don't know where to go. This happened last week and I haven't slept since. I don't know what to do anymore.
```

Verify:
- [ ] Character counter updates as you type
- [ ] Submit button is enabled (text > 20 chars)
- [ ] Click "Submit Assessment"

#### Test 4: Backend Processing
Monitor the backend terminal. You should see:
```
INFO: POST /api/assess
...
assessment_submitted event logged
```

Expected response includes:
- `case_id` (e.g., "case_a3f2e1b9")
- `svi_score` (should be ~65-75 for test text)
- `category` ("High" or "Critical")
- `recommended_action` (text-based)
- `analysis_breakdown` (sentiment, emotion, crisis scores)

#### Test 5: Results Page
- [ ] Navigate to `/results/{case_id}`
- [ ] Title: "Your Assessment Results"
- [ ] SVI score displayed large (should be ~70)
- [ ] Category badge (e.g., "High Risk" in orange)
- [ ] Recommended action displayed
- [ ] Contributing factors grid (Emotional Intensity, Sentiment, Risk Indicators, Voice Stress)
- [ ] Case ID shown (anonymized)
- [ ] "Back to Home" and "View Dashboard" buttons
- [ ] Next steps section
- [ ] Footer disclaimer visible

#### Test 6: Counsellor Dashboard
- [ ] Click "View Dashboard"
- [ ] Navigate to `/dashboard`
- [ ] Title: "Counsellor Case Review"
- [ ] Text field: "Reviewed by:" (for counsellor name)
- [ ] "Refresh" button
- [ ] Case table with columns:
  - Case ID
  - Submitted (timestamp)
  - Language (EN)
  - SVI Score (70)
  - Category (badge - orange/red)
  - Excerpt (first part of your text)
  - Recommended Action
  - Status (should say "Pending")
- [ ] "Mark as Reviewed" button visible

**Action:** 
1. Enter counsellor name: "Dr. Priya Sharma"
2. Click "Mark Reviewed" button on the case row

#### Test 7: Audit Trail & Review
- [ ] Case status changes to "✓ Reviewed"
- [ ] "Mark as Reviewed" button disappears
- [ ] Click "Refresh" button
- [ ] Case still shows as reviewed
- [ ] Backend should have created audit log entry

**Verify in backend terminal:**
```
case_marked_reviewed event logged
```

#### Test 8: Language Toggle (Hindi)
- [ ] Go back to landing page (`/`)
- [ ] Click language toggle (top right) to change to "हिन्दी"
- [ ] All text should now be in Hindi:
  - Headline changes
  - Button labels change
  - Navigation text changes
- [ ] Click "Start Assessment"
- [ ] Consent screen should be in Hindi
- [ ] All labels + instructions in Hindi

#### Test 9: Multiple Cases (Optional)
- [ ] Go back to landing (`/`)
- [ ] Click "Start Assessment" again
- [ ] Accept consent
- [ ] Enter different text (shorter text, different tone)
- [ ] Submit
- [ ] Go to dashboard
- [ ] Should see both cases in the table
- [ ] Cases sorted by SVI (higher scores first)

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Port 8000 already in use"**
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Error: "ModuleNotFoundError"**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Error: "Database locked"**
```bash
# Delete the SQLite database and restart
rm sahai_demo.db
# Backend will recreate on startup
```

### Frontend Issues

**Error: "Port 5173 already in use"**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Error: "Module not found"**
```bash
# Reinstall dependencies
npm install --legacy-peer-deps
```

**Error: "CORS error in browser console"**
- Verify backend is running on `http://localhost:8000`
- Check `backend/app/config/settings.py` CORS settings
- Ensure frontend is on `http://localhost:5173`

### API Debugging

**Check backend is responding:**
```bash
curl -X GET http://localhost:8000/api/health
```

**View API documentation:**
- Open `http://localhost:8000/docs` in browser
- Try endpoints directly in Swagger UI

**Test submit assessment:**
```bash
curl -X POST http://localhost:8000/api/assess \
  -H "Content-Type: application/json" \
  -d '{"text":"I am very scared and don'\''t know what to do","language":"en"}'
```

---

## ✅ Sign-Off Checklist

- [ ] Backend starts without errors (port 8000)
- [ ] Frontend starts without errors (port 5173)
- [ ] Landing page loads with correct styling
- [ ] All 5 pages accessible via navigation
- [ ] Language toggle works (EN ↔ HI)
- [ ] Assessment submission works (text → SVI score)
- [ ] Dashboard displays case with SVI score
- [ ] Mark as reviewed works + updates status
- [ ] Audit log created (visible in backend logs)
- [ ] Footer disclaimer on all pages
- [ ] No console errors in browser
- [ ] No 500 errors in backend logs

---

## 📁 Key Files for Reference

### Configuration (Customize Here)

```
backend/app/config/settings.py
├─ SENTIMENT_WEIGHT = 0.35          ← Tune this
├─ EMOTION_WEIGHT = 0.30            ← Tune this
├─ CRISIS_KEYWORD_WEIGHT = 0.25     ← Tune this
└─ VOICE_STRESS_WEIGHT = 0.10       ← Tune this
```

```
backend/app/config/crisis_keywords.json
└─ {} ← POPULATE with professional crisis terms
```

### Frontend Pages

```
frontend/src/pages/
├─ LandingPage.jsx              ← Hero design per spec
├─ ConsentScreen.jsx            ← Privacy + language
├─ IntakeFlow.jsx               ← Text input
├─ AssessmentResults.jsx        ← SVI display
└─ CounsellorDashboard.jsx      ← Case management
```

### Backend Services

```
backend/app/services/
├─ svi_calculator.py            ← Weighted formula
├─ sentiment_scorer.py          ← Lexicon-based
├─ emotion_scorer.py            ← Fear/anger/desperation
├─ crisis_keywords.py           ← Config-driven
├─ voice_analyzer.py            ← Mock stress analysis
└─ speech_to_text.py            ← Mock transcription
```

---

## 🎓 Next Steps After Testing

1. **Populate crisis_keywords.json** with professionally-sourced terms
2. **Adjust SVI weights** if needed based on test results
3. **Add authentication** to dashboard (JWT tokens)
4. **Integrate real Whisper API** when ready
5. **Deploy to cloud** (AWS, GCP, Azure) for production
6. **Connect to official NHAA backend** for real case management

---

## 📞 Support & Questions

- **API Issues?** Check `http://localhost:8000/docs` (Swagger UI)
- **Frontend Issues?** Check browser console (F12)
- **Database Issues?** Check SQLite file: `backend/sahai_demo.db`
- **Need to reset?** Delete `sahai_demo.db` and restart backend

---

**Status:** ✅ Complete and ready for full E2E testing  
**Last Updated:** 2026-08-25  
**Version:** 0.1.0 (Hackathon Prototype)
