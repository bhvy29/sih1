#!/usr/bin/env python3
"""
Simple test to see what Gemini actually returns
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key present: {bool(api_key)}")

genai.configure(api_key=api_key)

# Try the simplest possible request
simple_prompt = """Respond with ONLY valid JSON, no other text:
{"svi_score": 50, "category": "Low", "recommended_action": "test", "breakdown": {"emotional_intensity": 20, "sentiment": 10, "crisis_indicators": 15, "narrative_severity": 18}, "report": "test report"}"""

print("\nCalling Gemini with simple prompt...")
try:
    model = genai.GenerativeModel("gemini-3.6-flash")
    response = model.generate_content(
        simple_prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.0,
            max_output_tokens=200,
        ),
    )

    print(f"\nResponse received:")
    print(f"Type: {type(response.text)}")
    print(f"Length: {len(response.text)}")
    print(f"Content: {repr(response.text[:300])}")
    print(f"\nFull response:\n{response.text}")

    # Try to parse it
    import json
    try:
        result = json.loads(response.text)
        print("\n✅ Valid JSON parsed!")
        print(f"Keys: {result.keys()}")
    except json.JSONDecodeError as e:
        print(f"\n❌ JSON parse error: {e}")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
