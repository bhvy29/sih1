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


from app.services.sentiment_scorer import score_sentiment
from app.services.emotion_scorer import score_emotion

def _fallback_result(transcript: str, reason: str = "") -> dict:
    """Intelligent fallback assessment using sentiment, emotion, and crisis lexicons."""
    sentiment_val = score_sentiment(transcript) if transcript else 50.0
    emotion_val = score_emotion(transcript) if transcript else 0.0
    is_critical, crisis_score, matched = detect_crisis_keywords(transcript) if transcript else (False, 0.0, [])

    # Calculate heuristic SVI score
    sentiment_distress = max(0.0, (100.0 - sentiment_val))
    narrative_sev = min(100.0, (emotion_val * 0.5) + (sentiment_distress * 0.5))

    if is_critical:
        svi_score = max(crisis_score, 88.0)
        category = "Critical"
        rec_action = "FLAG FOR IMMEDIATE HUMAN REVIEW (crisis keyword detected)"
        report_text = f"[CRITICAL] Immediate safety concern detected. High distress signals and crisis indicators present in narrative. Priority human review assigned."
    else:
        svi_score = round((emotion_val * 0.35) + (sentiment_distress * 0.45) + (narrative_sev * 0.20), 1)
        if svi_score >= 76.0:
            category = "Critical"
            rec_action = "Urgent priority consultation and immediate safety plan recommended"
            report_text = f"Patient narrative indicates severe distress (SVI: {svi_score:.1f}). Recommended for priority clinical intake."
        elif svi_score >= 51.0:
            category = "High"
            rec_action = "Urgent counsellor consultation + legal aid referral recommended"
            report_text = f"Patient disclosure shows significant distress and trauma burden (SVI: {svi_score:.1f}). Counsellor consultation recommended."
        elif svi_score >= 26.0:
            category = "Moderate"
            rec_action = "Counsellor callback can be arranged; informational support recommended"
            report_text = f"Patient disclosure indicates moderate stress levels (SVI: {svi_score:.1f}). Standard support resources recommended."
        else:
            category = "Low"
            rec_action = "Self-help resources and informational materials available"
            report_text = f"Assessment indicates low distress levels (SVI: {svi_score:.1f}). Informational support resources provided."

    return {
        "svi_score": svi_score,
        "category": category,
        "recommended_action": rec_action,
        "breakdown": {
            "emotional_intensity": round(emotion_val, 1),
            "sentiment": round(sentiment_val, 1),
            "crisis_indicators": round(crisis_score if is_critical else (25.0 if svi_score >= 50 else 0.0), 1),
            "narrative_severity": round(narrative_sev, 1),
        },
        "report": report_text,
    }


def generate_full_assessment(transcript: str, language: str = "en") -> dict:
    if not transcript or not transcript.strip():
        return _fallback_result("", "empty transcript")

    # Try Gemini API if key is present
    if GEMINI_API_KEY:
        prompt = ASSESSMENT_PROMPT.format(transcript=transcript, language=language)
        # Try standard Gemini models in order
        candidate_models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]
        for model_name in candidate_models:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.1,
                        max_output_tokens=1000,
                    ),
                )
                result = _extract_json(response.text)

                required_keys = {"svi_score", "category", "recommended_action", "breakdown", "report"}
                if required_keys.issubset(result.keys()):
                    # === SAFETY NET: crisis keyword override ===
                    is_critical, keyword_risk_score, matched_terms = detect_crisis_keywords(transcript)
                    if is_critical:
                        result["category"] = "Critical"
                        result["svi_score"] = max(float(result.get("svi_score", 0)), 90.0)
                        result["recommended_action"] = "FLAG FOR IMMEDIATE HUMAN REVIEW (crisis keyword detected)"
                        result["report"] = (
                            "⚠️ Crisis keyword safety net triggered. " + str(result.get("report", ""))
                        )
                    return result
            except Exception:
                continue

    # Fallback to local heuristic assessment engine if Gemini API is unauthenticated or unavailable
    return _fallback_result(transcript, "local assessment engine")