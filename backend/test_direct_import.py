#!/usr/bin/env python3
"""
Direct import test for Gemini assessment function.
Tests that GEMINI_API_KEY loads correctly and assessment works.
Run from backend directory: python test_direct_import.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 70)
print("🧪 Direct Import Test - Gemini Assessment Function")
print("=" * 70)
print()

# Step 1: Check environment
print("1️⃣  Checking environment setup...")
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("   ❌ GEMINI_API_KEY not found in environment")
    sys.exit(1)
else:
    print(f"   ✅ GEMINI_API_KEY loaded: {api_key[:20]}...{api_key[-5:]}")

print()

# Step 2: Import the assessment function
print("2️⃣  Importing assessment function...")
try:
    from app.services.ai_assessment import generate_full_assessment
    print("   ✅ Successfully imported generate_full_assessment")
except ImportError as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

print()

# Step 3: Run a test assessment
print("3️⃣  Running test assessment...")
test_transcript = "I am very scared and don't know where to go. I feel hopeless and alone."
print(f"   Input: {test_transcript}")
print()

try:
    result = generate_full_assessment(test_transcript, language="en")
    print("   ✅ Assessment generated successfully")
except Exception as e:
    print(f"   ❌ Assessment failed: {e}")
    sys.exit(1)

print()

# Step 4: Analyze the result
print("4️⃣  Analyzing result...")
print()

svi_score = result.get("svi_score")
category = result.get("category")
recommended_action = result.get("recommended_action")
breakdown = result.get("breakdown", {})
report = result.get("report", "")

# Check if this is the fallback result (score=50, category=Moderate)
is_fallback = (svi_score == 50.0 and category == "Moderate" and
               "AI assessment unavailable" in recommended_action)

if is_fallback:
    print("   ⚠️  WARNING: This is the FALLBACK result (Gemini call failed)")
    print("   This typically means:")
    print("   - Invalid GEMINI_API_KEY")
    print("   - API rate limit exceeded")
    print("   - Network connectivity issue")
    print("   - Gemini service temporarily unavailable")
    print()
    print("   Full fallback response:")
    print(f"   {result}")
    sys.exit(1)
else:
    print("   ✅ Real Gemini result (not fallback)")

print()

# Display the result
print("📊 Assessment Result:")
print("-" * 70)
print(f"   SVI Score:          {svi_score} / 100")
print(f"   Category:           {category}")
print(f"   Recommended Action: {recommended_action}")
print()
print("   Breakdown:")
print(f"      Emotional Intensity:  {breakdown.get('emotional_intensity', 'N/A')}")
print(f"      Sentiment:            {breakdown.get('sentiment', 'N/A')}")
print(f"      Crisis Indicators:    {breakdown.get('crisis_indicators', 'N/A')}")
print(f"      Narrative Severity:   {breakdown.get('narrative_severity', 'N/A')}")
print()
print("   AI Report:")
print(f"      {report}")
print()

# Validate the result
print("5️⃣  Validating result structure...")
print()

required_keys = {"svi_score", "category", "recommended_action", "breakdown", "report"}
missing_keys = required_keys - set(result.keys())

if missing_keys:
    print(f"   ❌ Missing required keys: {missing_keys}")
    sys.exit(1)
else:
    print("   ✅ All required keys present")

# Check score is reasonable
if not isinstance(svi_score, (int, float)) or not (0 <= svi_score <= 100):
    print(f"   ❌ Invalid SVI score: {svi_score} (must be 0-100)")
    sys.exit(1)
else:
    print(f"   ✅ SVI score valid: {svi_score}")

# Check category is valid
valid_categories = {"Low", "Moderate", "High", "Critical"}
if category not in valid_categories:
    print(f"   ❌ Invalid category: {category}")
    sys.exit(1)
else:
    print(f"   ✅ Category valid: {category}")

# Check breakdown structure
required_breakdown_keys = {"emotional_intensity", "sentiment", "crisis_indicators", "narrative_severity"}
missing_breakdown_keys = required_breakdown_keys - set(breakdown.keys())

if missing_breakdown_keys:
    print(f"   ❌ Missing breakdown keys: {missing_breakdown_keys}")
    sys.exit(1)
else:
    print(f"   ✅ Breakdown structure valid")

# Check report is non-empty
if not report or not isinstance(report, str):
    print(f"   ❌ Invalid report: {report}")
    sys.exit(1)
else:
    print(f"   ✅ Report is valid text")

print()
print("=" * 70)
print("✅ ALL TESTS PASSED - Gemini integration is working correctly!")
print("=" * 70)
print()
print("Full result JSON:")
import json
print(json.dumps(result, indent=2))
