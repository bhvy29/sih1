# SahAI - AI-Based Real-Time Stress & Trauma Assessment for NHAA 14566

A full-stack prototype for **Smart India Hackathon** demonstrating an AI-powered triage system for victims/complainants accessing the National Helpline Against Atrocities (NHAA 14566).

**⚠️ DISCLAIMER:** This is a **student prototype** created for a hackathon. It is **not affiliated with or a substitute for official NHAA 14566 services**. All analysis is decision-support only—not clinical diagnosis. A trained human counsellor must review all cases before any action is taken.

---

## 🎯 Problem & Solution

**Problem:** Trauma victims calling NHAA 14566 need rapid triage to connect them with appropriate resources (self-help → counsellor callback → legal aid + crisis support → immediate escalation).

**Solution:** SahAI uses NLP and mock voice analysis to assess stress levels in real-time, helping route cases by urgency while maintaining full human oversight.

---

## 🏗️ Architecture

### Monorepo Structure
```
sih1/
├── frontend/              # React + Tailwind CSS (Vite)
│   ├── src/
│   │   ├── pages/        # Landing, Consent, Intake, Results, Dashboard
│   │   ├── services/     # API client, i18n
│   │   └── App.jsx       # Router
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/               # FastAPI (Python)
│   ├── app/
│   │   ├── main.py       # FastAPI app + routes
│   │   ├── database/     # SQLAlchemy models (Case, AuditLog)
│   │   ├── services/     # SVI calculator, NLP, voice analysis
│   │   ├── routes/       # /assess, /cases, /cases/{id}/review
│   │   ├── config/       # Settings, crisis keywords (empty)
│   │   └── utils/        # Logger, anonymization
│   ├── requirements.txt
│   └── .env.example
├── README.md
└── .gitignore
```

### Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + i18next (English/Hindi)
- **Backend:** FastAPI + SQLAlchemy ORM + SQLite
- **Database:** SQLite (local file, no external DB needed)
- **NLP:** Lexicon-based sentiment/emotion scoring (structured for transformer swap-in)
- **Voice:** Mock audio analysis (structured for Librosa/Whisper swap-in)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip / npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server (localhost:8000)
python -m uvicorn app.main:app --reload
```

API documentation available at: **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Run dev server (localhost:5173)
npm run dev
```

---

## 📋 Demo Flow

1. **Landing Page** (`/`) — Overview, CTAs, disclaimer
2. **Consent Screen** (`/consent`) — Language toggle (EN/हिन्दी), plain-language privacy notice
3. **Intake Assessment** (`/intake`) — Victim describes situation (text input, voice button mocked)
4. **Results Page** (`/results/:caseId`) — SVI score (0-100), category, recommended action, contributing factors
5. **Counsellor Dashboard** (`/dashboard`) — Case list sorted by risk (Critical pinned to top), mark-as-reviewed audit trail

### Test Case

```
Text: "I am very scared and don't know where to go. This happened last week and I haven't slept since."

Expected Output:
- SVI Score: ~65-70 (High/Critical range)
- Category: High
- Recommended Action: "Urgent counsellor + legal aid consultation"
- Contributing Factors: High emotion/fear, moderate desperation indicators
```

---

## 🧠 Stress Vulnerability Index (SVI) - How It Works

### Formula

```
SVI = (sentiment_score × 0.35) +
      (emotion_score × 0.30) +
      (crisis_keyword_risk × 0.25) +
      (voice_stress_score × 0.10)
```

**Weights are tunable in `backend/app/config/settings.py`:**

```python
SENTIMENT_WEIGHT = 0.35         # Positive/negative sentiment
EMOTION_WEIGHT = 0.30           # Detected emotions (fear, anger, desperation)
CRISIS_KEYWORD_WEIGHT = 0.25    # High-risk keyword detection
VOICE_STRESS_WEIGHT = 0.10      # Voice stress indicators
```

### Categories & Actions

| SVI Score | Category | Recommended Action |
|-----------|----------|-------------------|
| 0–25 | Low | Self-help resources, informational materials |
| 26–50 | Moderate | Counsellor callback available |
| 51–75 | High | Urgent counsellor + legal aid consultation |
| 76–100 | Critical | **FLAG FOR HUMAN REVIEW** (no auto-escalation) |

**Critical cases do NOT trigger external actions** — they are flagged for counsellor review only.

---

## 🔒 Privacy & Security

### What's Stored
- ✅ Case metadata: timestamp, language, SVI score, category, anonymized transcript excerpt
- ✅ Audit log: who reviewed which case, when
- ✅ Anonymized case IDs (UUID-based)

### What's NOT Stored
- ❌ Raw audio files (deleted after transcription/analysis)
- ❌ Personally identifiable information (names, addresses, contact details)
- ❌ Full transcript (only excerpt stored)
- ❌ Medical/clinical records

### Code Comments
- All privacy-sensitive operations marked with comments explaining why
- Audio deletion explicitly noted in `backend/app/routes/intake.py`
- PII masking in `backend/app/utils/anonymize.py`

---

## 🎛️ Configurable Parameters

### SVI Weights
**File:** `backend/app/config/settings.py`

Edit these constants to tune how each signal contributes to the final score:
```python
SENTIMENT_WEIGHT = 0.35
EMOTION_WEIGHT = 0.30
CRISIS_KEYWORD_WEIGHT = 0.25
VOICE_STRESS_WEIGHT = 0.10
```

### Crisis Keywords (⚠️ IMPORTANT)
**File:** `backend/app/config/crisis_keywords.json`

This file is **intentionally left empty**. You MUST populate it with professionally-sourced crisis terms from:
- Published screening tools (Columbia-Suicide Severity Rating Scale, SAMHSA guidelines)
- DSM-5 criteria
- Mental health literature
- Your organization's guidelines

**Do NOT invent terms yourself.** Consult with a mental health professional.

Example structure:
```json
{
  "self_harm": ["suicide", "kill myself", "end it", ...],
  "violence": ["hurt someone", "attack", ...],
  "threats": ["will harm", "threat to", ...],
  "acute_distress": ["panic", "breakdown", ...]
}
```

---

## 🔄 Mock vs. Real APIs

### Current Implementation (Demo)

| Component | Current | Production |
|-----------|---------|-----------|
| **Speech-to-text** | Returns dummy text | Whisper API or local Whisper model |
| **Emotion scoring** | Keyword lexicon matching | DistilBERT or RoBERTa fine-tuned on trauma data |
| **Sentiment scoring** | Positive/negative word counts | Transformer-based sentiment model |
| **Voice analysis** | Random plausible values | Librosa (pitch, MFCC, formants) + scipy (pause detection) |
| **Crisis keywords** | Config-driven (empty for demo) | Professionally-sourced term database |
| **Database** | SQLite (local file) | PostgreSQL (production cloud DB) |
| **Authentication** | None | JWT or OAuth 2.0 |

---

## 📊 API Endpoints

### Intake Routes

#### `POST /api/assess`
Submit text or voice for assessment.

**Request:**
```json
{
  "text": "I am very scared...",
  "audio_base64": null,
  "language": "en"
}
```

**Response:**
```json
{
  "case_id": "case_a3f2e1b9",
  "svi_score": 72.5,
  "category": "High",
  "recommended_action": "Urgent counsellor + legal aid consultation",
  "analysis_breakdown": {
    "sentiment_score": 15.0,
    "emotion_score": 85.0,
    "crisis_keyword_risk": 0.0,
    "voice_stress_score": 0.0
  }
}
```

### Dashboard Routes

#### `GET /api/cases?limit=50&offset=0&category=Critical`
Fetch cases sorted by risk level (Critical first).

**Response:**
```json
{
  "cases": [
    {
      "case_id": "case_xyz123",
      "created_at": "2026-08-25T17:00:00",
      "language": "en",
      "svi_score": 85.0,
      "category": "Critical",
      "transcript_excerpt": "I am very scared...",
      "recommended_action": "FLAG FOR HUMAN REVIEW",
      "reviewed_by": null,
      "reviewed_at": null
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### `PATCH /api/cases/{case_id}/review`
Mark case as reviewed by counsellor.

**Request:**
```json
{
  "reviewed_by": "Dr. Priya Sharma"
}
```

#### `GET /api/cases/critical-count`
Get count of unreviewed Critical cases for alert badge.

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend
pytest
```

### Manual Testing via FastAPI Docs
```
http://localhost:8000/docs
```

Use the interactive Swagger UI to test endpoints.

### E2E Flow
1. Open `http://localhost:5173` (frontend)
2. Click "Start Assessment"
3. Accept consent
4. Enter test text: `"I am very scared and don't know where to go. This happened last week and I haven't slept since."`
5. Submit
6. Verify results page shows SVI score + category
7. Visit `/dashboard`
8. Verify case appears in the table
9. Mark as reviewed

---

## 📝 Project Structure Rationale

### Why Monorepo?
- Shared configuration and secrets
- Easy local development (both front/back run on localhost)
- Single deployment unit for hackathon

### Why FastAPI?
- Auto-generates `/docs` API documentation
- Async-native (scalable)
- Pydantic validation out-of-the-box
- Rapid prototyping

### Why SQLite?
- Zero external dependencies
- Single-file database (easy to back up, version control)
- Perfect for hackathon demos
- Can be swapped for PostgreSQL in production

### Why Lexicon-Based NLP?
- No GPU/ML infrastructure needed
- Deterministic and explainable
- Easy to test and debug
- Clear path to swap in transformer models later

---

## 🚨 Important Notes

### No Clinical Validity
This tool **does not provide clinical diagnosis** or psychiatric assessment. It is a **decision-support prototype** only. All cases must be reviewed by trained human counsellors.

### No Auto-Escalation
Critical cases do **not** trigger automatic phone calls, SMS alerts, or police notifications. All escalations are **human-reviewed and initiated manually**. This is intentional for safety.

### Crisis Keyword Config
The `crisis_keywords.json` file is **your responsibility**. You must populate it with professionally-reviewed terms. Using incorrect or incomplete keywords could cause harm.

### Data Retention
This prototype does **not** implement data retention policies. For production:
- Define retention schedules (e.g., delete cases after 6 months)
- Implement GDPR/CCPA-compliant data deletion
- Audit log retention separate from case data

---

## 🤝 Contributing & Future Work

### Immediate Improvements
1. [ ] Real voice recording (MediaRecorder API)
2. [ ] Real speech-to-text (Whisper API)
3. [ ] Transformer-based emotion detection
4. [ ] User authentication for counsellor dashboard
5. [ ] Email notifications for new Critical cases

### Production Roadmap
1. [ ] PostgreSQL database
2. [ ] Redis caching for case lookups
3. [ ] Multi-language support (expand beyond EN/HI)
4. [ ] Integration with official NHAA 14566 API
5. [ ] Legal aid provider directory
6. [ ] Video counselling support
7. [ ] Mobile app (React Native)
8. [ ] Automated follow-up messaging

---

## 📚 References

- **NHAA 14566:** National Helpline Against Atrocities — https://nhaa.nic.in/
- **Smart India Hackathon:** https://www.sih.gov.in/
- **Columbia-Suicide Severity Rating Scale:** https://www.cssrs.columbia.edu/
- **SAMHSA Crisis Resources:** https://www.samhsa.gov/
- **Whisper (Speech-to-Text):** https://github.com/openai/whisper
- **Librosa (Audio Analysis):** https://librosa.org/

---

## 📄 License

Created for Smart India Hackathon 2026. Non-commercial use only.

---

## ✉️ Contact & Support

For questions about this prototype:
- Check the API docs: `http://localhost:8000/docs`
- Review config files for tunable parameters
- See `CLAUDE.md` for development notes (if present)

For official NHAA support:
- Call: **14566**
- Website: https://nhaa.nic.in/

---

**Last Updated:** 2026-08-25  
**Status:** Hackathon Prototype (v0.1.0)  
**Disclaimer:** Not affiliated with official NHAA services. Student work for educational/competition purposes only.
