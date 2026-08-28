"""
AI Assessment Engine

Uses Google Gemini to generate the full assessment in one call:
- SVI score (0-100)
- Risk category (Low/Moderate/High/Critical)
- Recommended action
- Contributing factors breakdown
- Human-readable narrative report

SAFETY NET: A crisis-keyword check runs independently of Gemini, using the
SINGLE consolidated implementation in app/services/crisis_keywords.py (word-
boundary matching, not substring matching). If any crisis term is detected,
the result is force-upgraded to "Critical" regardless of what Gemini returns.
"""

import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv
from app.services.crisis_keywords import detect_crisis_keywords

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


ASSESSMENT_PROMPT = """You are a crisis assessment AI for a victim support helpline. Analyze the transcript below and respond with ONLY a valid JSON object (no markdown, no text before or after).

Respond with this exact JSON structure:
{{
  "svi_score": <number from 0 to 100>,
  "category": "<Low|Moderate|High|Critical>",
  "recommended_action": "<brief action for counsellor>",
  "breakdown": {{
    "emotional_intensity": <number 0-100>,
    "sentiment": <number -100 to 100>,
    "crisis_indicators": <number 0-100>,
    "narrative_severity": <number 0-100>
  }},
  "report": "<2-4 sentences describing the case>"
}}

SCORING RULES:
- 0-25 (Low): mild or no distress
- 26-50 (Moderate): noticeable distress, no acute danger
- 51-75 (High): significant distress, fear, trauma references, isolation
- 76-100 (Critical): explicit danger, threats, violence, self-harm/suicidal language

IMPORTANT: A clearly calm, happy, or stable statement (e.g. "I am happy and stable")
must score LOW (under 15), with sentiment near +80 to +100 (positive), not negative.

Always respond with ONLY JSON. No preamble. No explanation. Just the JSON object.

Transcript: {transcript}
Language: {language}"""


def _extract_json(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```json\s*", "", cleaned)
    cleaned = re.sub(r"^```\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


def _fallback_result(reason: str) -> dict:
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
    if not GEMINI_API_KEY:
        return _fallback_result("GEMINI_API_KEY not configured")

    if not transcript or not transcript.strip():
        return _fallback_result("empty transcript")

    prompt = ASSESSMENT_PROMPT.format(transcript=transcript, language=language)

    try:
        model = genai.GenerativeModel("gemini-3.5-flash-lite")
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                max_output_tokens=1000,
            ),
        )
        result = _extract_json(response.text)

        required_keys = {"svi_score", "category", "recommended_action", "breakdown", "report"}
        if not required_keys.issubset(result.keys()):
            return _fallback_result("incomplete AI response")

    except Exception as e:
        return _fallback_result(f"AI call failed: {str(e)}")

    # === SAFETY NET: crisis keyword override (word-boundary matching, single source) ===
    is_critical, keyword_risk_score, matched_terms = detect_crisis_keywords(transcript)
    if is_critical:
        result["category"] = "Critical"
        result["svi_score"] = max(float(result.get("svi_score", 0)), 90.0)
        result["recommended_action"] = "FLAG FOR IMMEDIATE HUMAN REVIEW (crisis keyword detected)"
        result["report"] = (
            "⚠️ Crisis keyword safety net triggered. " + str(result.get("report", ""))
        )

    return result