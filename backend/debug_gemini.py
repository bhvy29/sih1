#!/usr/bin/env python3
"""
Debug script to see the raw Gemini response
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:20]}...{api_key[-5:]}")

genai.configure(api_key=api_key)

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

Important: Always respond with ONLY JSON. No preamble. No explanation. Just the JSON object.

Transcript: {transcript}
Language: {language}"""

transcript = "I am very scared and don't know where to go. I feel hopeless and alone."
prompt = ASSESSMENT_PROMPT.format(transcript=transcript, language="en")

print(f"\nPrompt length: {len(prompt)} chars")
print("\n" + "="*70)
print("🤖 Calling Gemini API...")
print("="*70)

try:
    model = genai.GenerativeModel("gemini-3.6-flash")
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.2,
            max_output_tokens=500,
        ),
    )

    print("\n✅ API Call Successful")
    print(f"Response text (first 500 chars):\n{response.text[:500]}")
    print(f"\nFull response:\n{response.text}")

    import json
    try:
        result = json.loads(response.text)
        print("\n✅ Valid JSON parsed successfully")
        print(f"Keys: {result.keys()}")
    except json.JSONDecodeError as e:
        print(f"\n❌ JSON parsing failed: {e}")
        print(f"Response was: {repr(response.text[:200])}")

except Exception as e:
    print(f"\n❌ API call failed: {e}")
    import traceback
    traceback.print_exc()
