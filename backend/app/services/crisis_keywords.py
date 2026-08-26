"""
Crisis Keywords Detection

Loads professionally-sourced crisis keywords from config and detects their presence.
This is a SAFETY-CRITICAL component—the config file is intentionally left empty.
You MUST populate it with terms from published screening tools.

Structured to support custom keyword weighting and severity levels for real implementation.
"""

import json
import os
from app.config.settings import CRISIS_KEYWORDS_PATH


def load_crisis_keywords():
    """Load crisis keywords from config file."""
    try:
        if os.path.exists(CRISIS_KEYWORDS_PATH):
            with open(CRISIS_KEYWORDS_PATH, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load crisis keywords: {e}")

    # Default empty structure
    return {
        "self_harm": [],
        "violence": [],
        "threats": [],
        "acute_distress": [],
    }


# Load on module import
CRISIS_KEYWORDS_CONFIG = load_crisis_keywords()


def detect_crisis_keywords(text: str) -> tuple:
    """
    Detect presence of crisis keywords in text.

    Args:
        text (str): Input text to analyze

    Returns:
        tuple: (is_critical_detected: bool, risk_score: float 0-100)
            - is_critical_detected: True if high-severity terms found
            - risk_score: Numerical risk contribution (0-100)
    """
    if not text or len(text.strip()) == 0:
        return False, 0

    text_lower = text.lower()

    # Flatten all keywords for detection
    all_keywords = []
    for category, keywords in CRISIS_KEYWORDS_CONFIG.items():
        if category != "_comment":  # Skip metadata
            all_keywords.extend(keywords)

    if not all_keywords:
        # Config is empty (as expected in prototype)
        return False, 0

    # Count keyword matches
    matches = []
    for keyword in all_keywords:
        if keyword.lower() in text_lower:
            matches.append(keyword)

    if not matches:
        return False, 0

    # Determine criticality and risk score
    is_critical = len(matches) > 0  # Any match is concerning in production

    # Risk score: more matches = higher risk
    # In production, weight by keyword severity
    risk_score = min(100, len(matches) * 20)  # ~5 matches = critical

    return is_critical, risk_score
