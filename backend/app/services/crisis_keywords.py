"""
Crisis Keywords Detection

Loads professionally-sourced crisis keywords from config and detects their presence.
This is a SAFETY-CRITICAL component—the config file is intentionally left empty by
default. You MUST populate it with terms from published screening tools (e.g.
Columbia-Suicide Severity Rating Scale, SAMHSA guidelines) reviewed by a mental
health professional, not invented ad hoc.

MATCHING: Uses word-boundary regex matching, not plain substring matching. This
prevents false positives like "end" matching inside "friend", or a keyword
matching inside an unrelated word like "stable".
"""

import json
import os
import re
from app.config.settings import CRISIS_KEYWORDS_PATH


def load_crisis_keywords():
    """Load crisis keywords from config file."""
    try:
        if os.path.exists(CRISIS_KEYWORDS_PATH):
            with open(CRISIS_KEYWORDS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load crisis keywords: {e}")

    return {
        "self_harm": [],
        "violence": [],
        "threats": [],
        "acute_distress": [],
    }


CRISIS_KEYWORDS_CONFIG = load_crisis_keywords()


def _word_boundary_match(keyword: str, text_lower: str) -> bool:
    pattern = r'\b' + re.escape(keyword.lower().strip()) + r'\b'
    return re.search(pattern, text_lower) is not None


def detect_crisis_keywords(text: str) -> tuple:
    """
    Returns: (is_critical_detected: bool, risk_score: float, matched_terms: list)
    """
    if not text or len(text.strip()) == 0:
        return False, 0, []

    text_lower = text.lower()

    all_keywords = []
    for category, keywords in CRISIS_KEYWORDS_CONFIG.items():
        if category != "_comment":
            all_keywords.extend(keywords)

    if not all_keywords:
        return False, 0, []

    matches = [kw for kw in all_keywords if _word_boundary_match(kw, text_lower)]

    if not matches:
        return False, 0, []

    is_critical = len(matches) > 0
    risk_score = min(100, len(matches) * 20)

    return is_critical, risk_score, matches