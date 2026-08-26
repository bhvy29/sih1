import os

# ===== SVI (Stress Vulnerability Index) Weights =====
# TUNE THESE CONSTANTS to adjust the contribution of each signal to the final SVI score.
# All weights should sum to ~1.0 when voice features are available, or adjust proportionally if no voice.

SENTIMENT_WEIGHT = 0.35  # Positive/negative word sentiment
EMOTION_WEIGHT = 0.30    # Detected emotions (fear, anger, desperation, etc.)
CRISIS_KEYWORD_WEIGHT = 0.25  # High-risk keyword detection
VOICE_STRESS_WEIGHT = 0.10    # Voice stress indicators (pitch, pause, rate)

# ===== SVI Category Thresholds =====
SVI_THRESHOLDS = {
    "Low": (0, 25),
    "Moderate": (26, 50),
    "High": (51, 75),
    "Critical": (76, 100),
}

# ===== Recommended Actions by Category =====
RECOMMENDED_ACTIONS = {
    "Low": "Self-help resources and informational materials available",
    "Moderate": "Counsellor callback can be arranged; informational support recommended",
    "High": "Urgent counsellor consultation + legal aid referral recommended",
    "Critical": "FLAGGED FOR IMMEDIATE HUMAN REVIEW - No automatic escalation; counsellor review required",
}

# ===== Database Configuration =====
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sahai_demo.db")

# ===== Crisis Keywords Config Path =====
CRISIS_KEYWORDS_PATH = os.path.join(
    os.path.dirname(__file__), "crisis_keywords.json"
)

# ===== Logging & Debug =====
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# ===== Frontend/Backend URLs (for CORS) =====
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
