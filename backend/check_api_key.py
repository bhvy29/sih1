#!/usr/bin/env python3
"""
Test Gemini API key validity and quota
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:20]}...{api_key[-10:]}")

genai.configure(api_key=api_key)

print("\n" + "="*70)
print("Testing Gemini API Key Validity")
print("="*70)

try:
    # List available models
    print("\nListing available models...")
    models = genai.list_models()

    model_count = 0
    for model in models:
        model_count += 1
        if "gemini" in model.name.lower():
            print(f"  • {model.name}")
        if model_count >= 5:
            print("  ...")
            break

    if model_count > 0:
        print(f"\n✅ API key is VALID - can access {model_count}+ models")
    else:
        print("\n❌ API key appears invalid - no models accessible")

except Exception as e:
    print(f"\n❌ API key test failed: {e}")
    print("\nPossible issues:")
    print("  1. API key is expired or revoked")
    print("  2. API key quota exhausted")
    print("  3. API key has wrong permissions")
    print("  4. Network connectivity issue")
    sys.exit(1)

# Try a very short request
print("\n" + "="*70)
print("Testing Short Response")
print("="*70)

try:
    model = genai.GenerativeModel("gemini-3.6-flash")
    response = model.generate_content(
        "Say 'OK'",
        generation_config=genai.types.GenerationConfig(
            temperature=0.0,
            max_output_tokens=50,
        ),
    )

    print(f"\nResponse: {repr(response.text)}")
    print(f"Length: {len(response.text)} chars")

    if len(response.text) > 0:
        print("✅ Short response works")
    else:
        print("❌ Empty response - API may be rate limited")

except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*70)
