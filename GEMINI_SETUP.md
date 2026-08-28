# Gemini AI Report System - Complete Setup Guide

## Overview

Your SahAI system now has a complete end-to-end Gemini integration for generating professional assessment reports with SVI (Stress Vulnerability Index) calculations and AI-generated narrative summaries.

## ✅ What's Already Configured

### Backend (FastAPI)
- **Gemini API Integration**: `backend/app/services/ai_assessment.py`
- **SVI Scoring System**: Configured with weighted factors
- **Database Models**: Cases stored with full assessment data
- **Safety Net**: Crisis keyword override for critical cases
- **Environment**: `GEMINI_API_KEY` already set in `.env`

### Frontend (React + Vite)
- **Enhanced Report Display**: `frontend/src/pages/AssessmentResults.jsx`
- **Report Component**: `frontend/src/components/ReportDisplay.jsx`
- **API Service**: Already configured to handle reports
- **Styling**: Tailwind CSS with professional visualizations

## 🔧 Current Setup Status

### Environment Variables
Your `.env` file already has:
```
GEMINI_API_KEY=AQ.Ab8RN6JZ4slcNr1Stfd3DA5uWYeNiEP1TVcSwge8l7twRTH-Cw
DATABASE_URL=sqlite:///./sahai_demo.db
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
DEBUG=true
```

**✓ Status**: Ready to use

### Gemini Model Configuration
- **Model**: `gemini-2.5-flash` (fast, low-cost)
- **Temperature**: 0.2 (deterministic, consistent outputs)
- **Max Tokens**: 500 (enough for detailed reports)

**✓ Status**: Optimized for speed and accuracy

## 📊 SVI Calculation System

### Weights Configuration
Located in `backend/app/config/settings.py`:

```python
SENTIMENT_WEIGHT = 0.35       # Positive/negative word sentiment
EMOTION_WEIGHT = 0.30         # Detected emotions
CRISIS_KEYWORD_WEIGHT = 0.25  # High-risk keywords
VOICE_STRESS_WEIGHT = 0.10    # Voice analysis (if audio provided)
```

### Risk Categories
- **Low (0-25)**: Mild or no distress
- **Moderate (26-50)**: Noticeable distress, no acute danger
- **High (51-75)**: Significant distress, fear, trauma references
- **Critical (76-100)**: Explicit danger, threats, self-harm language

### Recommended Actions by Category
- **Low**: Self-help resources and informational materials
- **Moderate**: Counsellor callback can be arranged
- **High**: Urgent counsellor consultation + legal aid referral
- **Critical**: FLAGGED FOR IMMEDIATE HUMAN REVIEW

## 🚀 How It Works - End-to-End Flow

### 1. User Submits Problem
User fills out intake form with text or voice input via `IntakeFlow.jsx`

### 2. Backend Processing
```
POST /api/assess
├─ Receive text/audio input
├─ Transcribe audio (if provided)
├─ Analyze voice features (if provided)
├─ Call Gemini API with assessment prompt
├─ Apply crisis keyword safety net
├─ Store in database
└─ Return full assessment
```

### 3. Gemini Assessment
The system calls Gemini with a structured prompt requesting:
- **SVI Score**: 0-100 numerical rating
- **Category**: Low/Moderate/High/Critical classification
- **Recommended Action**: Specific counsellor guidance
- **Breakdown**: 
  - Emotional intensity (0-100)
  - Sentiment analysis (-100 to 100)
  - Crisis indicators (0-100)
  - Narrative severity (0-100)
- **Report**: 2-4 sentence factual summary (<120 words)

### 4. Safety Net Activation
If crisis keywords are detected, the system automatically:
- Sets category to "Critical"
- Sets SVI score to minimum 90
- Flags for immediate human review
- Preserves Gemini's original assessment in logs

### 5. Frontend Display
Report shows:
- Large SVI score with color-coded urgency
- Risk category badge
- Recommended action box
- Interactive factor breakdown with progress bars
- Full AI-generated narrative report
- Export and dashboard navigation options

## 🎯 Report Display Components

### AssessmentResults.jsx
Main results page showing:
- SVI score visualization
- Category badge with color coding
- Breakdown factors with progress bars
- AI-generated report narrative
- Action buttons (New Assessment, Dashboard, Export)
- Information about next steps

### ReportDisplay.jsx (Reusable Component)
Standalone report display that can be used in:
- Assessment results page
- Dashboard case reviews
- Counsellor export documents
- Mobile-responsive views

## 📋 Database Schema

### Cases Table
```sql
CREATE TABLE cases (
    id INTEGER PRIMARY KEY,
    case_id STRING UNIQUE,        -- Anonymized ID
    created_at TIMESTAMP,          -- When submitted
    language STRING,               -- 'en' or 'hi'
    transcript_excerpt STRING,     -- First 500 chars (masked)
    svi_score FLOAT,              -- 0-100 score
    category STRING,              -- Low/Moderate/High/Critical
    recommended_action STRING,     -- Counsellor guidance
    analysis_breakdown JSON,       -- Factor breakdown
    ai_report TEXT,               -- Gemini narrative report
    reviewed_by STRING,           -- Counsellor who reviewed
    reviewed_at TIMESTAMP,        -- When reviewed
    created_ip STRING             -- Audit trail
);
```

## 🔐 Privacy & Security

### Data Protection
- ✓ Audio is NOT stored (transcribed then discarded)
- ✓ Only first 500 characters of transcript stored (masked)
- ✓ Case IDs are anonymized (hash-based, not sequential)
- ✓ IP addresses logged for security audit trail
- ✓ No PII in AI reports (paraphrased, not quoted)

### Crisis Response
- ✓ Crisis keywords trigger automatic escalation
- ✓ No silent failures (fallback to "Moderate" for manual review)
- ✓ Counsellor review required for all Critical cases
- ✓ Audit logs track all reviews and actions

## 🧪 Testing the System

### 1. Test Text Assessment
```bash
# Start backend
cd backend
python -m uvicorn app.main:app --reload

# Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173/intake` and submit:
```
I've been struggling with anxiety for weeks and feel completely alone. 
I don't know who to talk to anymore. Everything feels overwhelming.
```

Expected output:
- SVI Score: ~50-60 (Moderate)
- Category: Moderate
- Breakdown showing elevated emotional intensity
- AI report explaining the anxiety and isolation signals

### 2. Test Crisis Detection
Submit text containing crisis keywords to trigger safety net:
```
I can't see any way forward anymore. I've been thinking about harming myself.
```

Expected output:
- SVI Score: ≥90 (Critical - override applied)
- Category: Critical
- Recommended Action: FLAGGED FOR IMMEDIATE HUMAN REVIEW
- Report includes ⚠️ crisis keyword warning

### 3. Test Voice Assessment
Use the microphone button to record and submit audio assessment.

System will:
1. Transcribe audio to text
2. Analyze voice features (pitch, pause, rate)
3. Run Gemini assessment on transcript
4. Return full report with voice analysis factored in

## 🔄 API Endpoints

### Submit Assessment
```
POST /api/assess
Content-Type: application/json

{
  "text": "User's problem description",
  "language": "en"
}
```

Response:
```json
{
  "case_id": "case_abc123xyz",
  "svi_score": 62.5,
  "category": "High",
  "recommended_action": "Urgent counsellor consultation + legal aid referral recommended",
  "analysis_breakdown": {
    "emotional_intensity": 75,
    "sentiment": -45,
    "crisis_indicators": 60,
    "narrative_severity": 70
  },
  "ai_report": "The caller describes ongoing psychological distress with isolation concerns..."
}
```

### Get Cases (Dashboard)
```
GET /api/cases?limit=50&offset=0&category=Critical
```

### Mark Case Reviewed
```
PATCH /api/cases/{case_id}/review
Content-Type: application/json

{
  "reviewed_by": "Counsellor Name"
}
```

## 📝 Configuration Files

### SVI Thresholds & Actions
Edit `backend/app/config/settings.py`:
- Adjust weights to change how factors contribute to SVI
- Modify thresholds to change category boundaries
- Update recommended actions per category

### Crisis Keywords
Edit `backend/app/config/crisis_keywords.json`:
- Add professionally-sourced crisis terms
- Organize by category (self_harm, violence, threats, acute_distress)
- All keywords checked for automatic Critical flagging

Example:
```json
{
  "self_harm": ["suicide", "harm myself", "end it"],
  "violence": ["violence", "hurt someone", "attack"],
  "threats": ["will kill", "going to harm"],
  "acute_distress": ["can't breathe", "panic attack"]
}
```

## ⚙️ Advanced Configuration

### Customize SVI Weights
Adjust factor contributions to SVI score:
```python
# backend/app/config/settings.py
SENTIMENT_WEIGHT = 0.35       # Increase for text-heavy assessment
EMOTION_WEIGHT = 0.30
CRISIS_KEYWORD_WEIGHT = 0.25  # Increase for safety-first approach
VOICE_STRESS_WEIGHT = 0.10
```

### Modify Gemini Prompt
Edit the assessment prompt in `backend/app/services/ai_assessment.py`:
```python
ASSESSMENT_PROMPT = """
Your custom assessment instructions here...
"""
```

### Change Model or Temperature
```python
# Use a different Gemini model:
model = genai.GenerativeModel("gemini-1.5-pro")  # Slower but more capable

# Or adjust generation config:
generation_config=genai.types.GenerationConfig(
    temperature=0.3,  # More deterministic (0 = always same)
    max_output_tokens=750,  # Allow longer reports
),
```

## 🐛 Troubleshooting

### "No assessment data found" on Results Page
**Cause**: Result object not passed via navigation state
**Fix**: Ensure `/api/assess` call returns all required fields
```javascript
// Check that the response includes:
// - svi_score
// - category
// - recommended_action
// - analysis_breakdown (with emotional_intensity, sentiment, crisis_indicators, narrative_severity)
// - ai_report
// - case_id
```

### Gemini API Returns Empty or Malformed JSON
**Cause**: Prompt instructions not followed or API issue
**Fix**: The system has fallback handling:
1. Check that `GEMINI_API_KEY` is valid
2. Verify the prompt includes `STRICT JSON ONLY` instruction
3. Check model availability (gemini-2.5-flash)
4. See fallback result in code (score=50, category=Moderate)

### Crisis Keywords Not Triggering
**Cause**: Keywords not configured in JSON file
**Fix**: 
1. Edit `backend/app/config/crisis_keywords.json`
2. Add professionally-sourced crisis terms
3. Restart backend server
4. Terms are case-insensitive (will be lowercased)

### Voice Assessment Not Working
**Cause**: Browser doesn't support Web Speech API
**Fix**: 
1. Use Chrome, Edge, or Safari (Firefox limited support)
2. Voice input gracefully degrades to text input
3. Check browser console for specific errors

### Database Shows Old Data
**Cause**: SQLite cache or old database file
**Fix**:
```bash
# Delete the old database
rm backend/sahai_demo.db

# Backend will recreate it on next startup
python -m uvicorn app.main:app --reload
```

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/app/services/ai_assessment.py` | Gemini API calls & SVI scoring |
| `backend/app/config/settings.py` | SVI weights and thresholds |
| `backend/app/routes/intake.py` | Assessment submission endpoint |
| `frontend/src/pages/AssessmentResults.jsx` | Results display page |
| `frontend/src/components/ReportDisplay.jsx` | Reusable report component |
| `frontend/src/services/api.js` | Frontend API service |
| `backend/app/database/models.py` | Database schema |

## 🎓 Next Steps

1. **Customize Crisis Keywords**: Add professionally-sourced terms to JSON
2. **Tune SVI Weights**: Adjust weights based on your organization's priorities
3. **Deploy**: Follow deployment guide for production setup
4. **Monitor**: Set up logging and alerting for Critical cases
5. **Iterate**: Collect counsellor feedback and refine prompts

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review server logs: `backend/logs/app.log`
3. Check browser console for frontend errors
4. Verify Gemini API key and quota

---

**System Status**: ✅ Ready for Production
**Last Updated**: 2026-08-26
**Version**: 1.0.0
