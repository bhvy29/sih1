#!/usr/bin/env python3
"""
Test Script for Gemini Report System
Validates that the complete assessment pipeline works end-to-end.
"""

import requests
import json
import time
from typing import Dict, Any

# Configuration
BACKEND_URL = "http://localhost:8000/api"
TEST_CASES = [
    {
        "name": "Low Risk - General Inquiry",
        "text": "I'm just looking for information about support services available for victims."
    },
    {
        "name": "Moderate Risk - Anxiety & Isolation",
        "text": "I've been struggling with anxiety for weeks and feel completely alone. I don't know who to talk to anymore. Everything feels overwhelming and I'm having trouble sleeping."
    },
    {
        "name": "High Risk - Trauma & Fear",
        "text": "I experienced harassment and now I'm living in constant fear. I can't leave my house without panic attacks. The perpetrator still lives nearby and I feel trapped."
    },
    {
        "name": "Critical Risk - Safety Concern",
        "text": "I can't see any way forward anymore. I've been thinking about ending it all. Nothing matters and I'm just a burden to everyone around me."
    }
]


def test_assessment(test_case: Dict[str, str]) -> Dict[str, Any]:
    """Submit a test assessment and return the response."""
    print(f"\n{'='*60}")
    print(f"Testing: {test_case['name']}")
    print(f"{'='*60}")
    print(f"Input: {test_case['text'][:80]}...")

    try:
        response = requests.post(
            f"{BACKEND_URL}/assess",
            json={
                "text": test_case['text'],
                "language": "en"
            },
            timeout=30
        )
        response.raise_for_status()
        result = response.json()

        print(f"\n✅ Assessment Generated:")
        print(f"   Case ID: {result.get('case_id')}")
        print(f"   SVI Score: {result.get('svi_score'):.1f}/100")
        print(f"   Category: {result.get('category')}")
        print(f"   Recommended Action: {result.get('recommended_action')}")

        if result.get('analysis_breakdown'):
            bd = result['analysis_breakdown']
            print(f"\n   Breakdown:")
            print(f"   - Emotional Intensity: {bd.get('emotional_intensity', 0):.1f}")
            print(f"   - Sentiment: {bd.get('sentiment', 0):.1f}")
            print(f"   - Crisis Indicators: {bd.get('crisis_indicators', 0):.1f}")
            print(f"   - Narrative Severity: {bd.get('narrative_severity', 0):.1f}")

        if result.get('ai_report'):
            print(f"\n   AI Report Preview:")
            report = result['ai_report']
            print(f"   {report[:150]}..." if len(report) > 150 else f"   {report}")

        return result

    except requests.exceptions.ConnectionError:
        print("❌ Failed to connect to backend. Is it running on port 8000?")
        return None
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Backend may be slow or unresponsive.")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e.response.status_code}")
        print(f"   Response: {e.response.text}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None


def test_health_check():
    """Verify backend is running."""
    print("🔍 Checking backend health...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        response.raise_for_status()
        print("✅ Backend is running and responding")
        return True
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        print("   Start the backend with: cd backend && python -m uvicorn app.main:app --reload")
        return False


def test_cases_endpoint():
    """Check if we can fetch cases."""
    print("\n🔍 Testing cases endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/cases?limit=5", timeout=5)
        response.raise_for_status()
        data = response.json()
        print(f"✅ Cases endpoint working. Total cases: {data.get('total', 0)}")
        return True
    except Exception as e:
        print(f"⚠️  Cases endpoint error: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("🧪 SahAI Gemini Report System - End-to-End Test")
    print("="*60)

    # Step 1: Health check
    if not test_health_check():
        return

    # Step 2: Check cases endpoint
    test_cases_endpoint()

    # Step 3: Run test assessments
    print("\n" + "="*60)
    print("Running Test Assessments")
    print("="*60)

    results = []
    for i, test_case in enumerate(TEST_CASES, 1):
        result = test_assessment(test_case)
        if result:
            results.append({
                "test": test_case['name'],
                "result": result
            })
        time.sleep(1)  # Rate limiting

    # Step 4: Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)

    if results:
        print(f"\n✅ Successfully generated {len(results)} assessments:")
        for r in results:
            print(f"   • {r['test']}: {r['result'].get('category')} (SVI: {r['result'].get('svi_score'):.1f})")

        print("\n📋 Full Results Saved:")
        with open('test_results.json', 'w') as f:
            json.dump(results, f, indent=2, default=str)
        print("   → test_results.json")

        print("\n✅ System appears to be working correctly!")
        print("\n🚀 Next steps:")
        print("   1. Visit http://localhost:5173 in your browser")
        print("   2. Navigate to the intake form")
        print("   3. Submit your own assessment")
        print("   4. Review the generated report with SVI score and breakdown")

    else:
        print("❌ No assessments generated successfully.")
        print("   Please check:")
        print("   • Backend is running (python -m uvicorn app.main:app --reload)")
        print("   • GEMINI_API_KEY is set in backend/.env")
        print("   • Database is accessible")


if __name__ == "__main__":
    main()
