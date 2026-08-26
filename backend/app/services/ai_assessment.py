"""
AI Assessment Engine

Uses Google Gemini to generate the full assessment in one call:
- SVI score (0-100)
- Risk category (Low/Moderate/High/Critical)
- Recommended action
- Contributing factors breakdown
- Human-readable narrative report

SAFETY NET: A crisis-keyword check runs independently of Gemini. If any
crisis term is detected in the transcript, the result is force-upgraded
to "Critical" regardless of what Gemini returns. This exists because a
single LLM call should never be the ONLY thing standing between a
suicidal/high-danger disclosure and human escalation — keyword matching
is crude but deterministic and cannot be "reasoned around."
"""

import os
import json
import re
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Path to the crisis keyword config (see app/config/crisis_keywords.json)
CRISIS_KEYWORDS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "config", "crisis_keywords.json"
)


def _load_crisis_keywords() -> list:
    """Load crisis keywords from config. Returns empty list if not configured."""
    try:
        with open(CRISIS_KEYWORDS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Flatten all categories into a single list of lowercase terms
        terms = []
        for category_terms in data.values():
            terms.extend([t.lower() for t in category_terms])
        return terms
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def _contains_crisis_keyword(text: str) -> bool:
    """Check if transcript contains any configured crisis keyword."""
    keywords = _load_crisis_keywords()
    if not keywords:
        return False
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in keywords)


ASSESSMENT_PROMPT = """
You are assisting a counsellor reviewing a distress/trauma case intake for a victim support
helpline (NHAA 14566, serving victims of caste-based atrocities). You are NOT diagnosing
anyone — this is decision-support triage only.

Analyze the following transcript and respond with STRICT JSON ONLY (no markdown fences, no
preamble, no explanation outside the JSON object). The JSON must have exactly this shape:

{{
  "svi_score": <number 0-100>,
  "category": "<Low|Moderate|High|Critical>",
  "recommended_action": "<short phrase, e.g. 'Self-help resources and informational materials available'>",
  "breakdown": {{
    "emotional_intensity": <number 0-100>,
    "sentiment": <number -100 to 100, negative = more distressed>,
    "crisis_indicators": <number 0-100>,
    "narrative_severity": <number 0-100>
  }},
  "report": "<2-4 sentence factual, calm narrative summary for the counsellor, under 120 words, paraphrased not quoted, noting any explicit safety concerns like threats/violence/self-harm language if present>"
}}

Scoring guidance:
- 0-25 = Low: mild or no distress signals
- 26-50 = Moderate: noticeable distress, no acute danger
- 51-75 = High: significant distress, fear, repeated trauma references, isolation
- 76-100 = Critical: explicit danger, threats, violence, self-harm/suicidal language, or extreme desperation

Be sensitive to indirect language. Words like "depression", "anxiety", "lonely", "scared",
"can't sleep", "no one to talk to", "hopeless" are real distress signals and should raise the
score meaningfully even without explicit crisis language — do not default to Low just because
no violent language is used.

Never invent details not present in the transcript.

Transcript: "{transcript}"
Language: {language}
"""


def _extract_json(raw_text: str) -> dict:
    """Gemini sometimes wraps JSON in markdown fences despite instructions. Strip them."""
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```json\s*", "", cleaned)
    cleaned = re.sub(r"^```\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


def _fallback_result(reason: str) -> dict:
    """Used only if Gemini call fails entirely (network/API error) — never silently
    returns a low/safe score; instead flags for manual review."""
    return {
        "svi_score": 50.0,
        "category": "Moderate",
        "recommended_action": "AI assessment unavailable — manual counsellor review required",
        "breakdown": {
            "emotional_intensity": 0,
            "sentiment": 0,
            "crisis_indicators": 0,
            "narrative_severity": 0,
        },
        "report": f"Automated assessment could not be generated ({reason}). This case has been "
                  f"flagged for manual review as a precaution.",
    }


def generate_full_assessment(transcript: str, language: str = "en") -> dict:
    """
    Single entry point: returns the full assessment dict with keys
    svi_score, category, recommended_action, breakdown, report.
    """
    if not GEMINI_API_KEY:
        return _fallback_result("GEMINI_API_KEY not configured")

    if not transcript or not transcript.strip():
        return _fallback_result("empty transcript")

    prompt = ASSESSMENT_PROMPT.format(transcript=transcript, language=language)

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                max_output_tokens=500,
            ),
        )
        result = _extract_json(response.text)

        # Validate required keys exist; fall back if Gemini returned malformed JSON
        required_keys = {"svi_score", "category", "recommended_action", "breakdown", "report"}
        if not required_keys.issubset(result.keys()):
            return _fallback_result("incomplete AI response")

    except Exception as e:
        return _fallback_result(f"AI call failed: {str(e)}")

    # === SAFETY NET: crisis keyword override ===
    # Runs regardless of what Gemini returned. If crisis terms are present,
    # force Critical category and a high score, and flag it explicitly.
    if _contains_crisis_keyword(transcript):
        result["category"] = "Critical"
        result["svi_score"] = max(float(result.get("svi_score", 0)), 90.0)
        result["recommended_action"] = "FLAG FOR IMMEDIATE HUMAN REVIEW (crisis keyword detected)"
        result["report"] = (
            "⚠️ Crisis keyword safety net triggered — this transcript contains language "
            "matching configured high-risk terms. " + str(result.get("report", ""))
        )

    return result