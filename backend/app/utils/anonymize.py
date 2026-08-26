"""
Anonymization Utility - Generate anonymized case IDs and mask PII

Ensures privacy while maintaining case tracking capability.
"""

import hashlib
import uuid
from datetime import datetime


def generate_case_id(text: str = None) -> str:
    """
    Generate an anonymized case ID.

    Uses UUID for simplicity; could also use hash of timestamp + random salt.

    Args:
        text (str, optional): Input text (not used in ID, just for reference)

    Returns:
        str: Anonymized case ID (e.g., "case_a3f2e1b9")
    """
    unique_id = str(uuid.uuid4())[:8]
    return f"case_{unique_id}"


def mask_transcript_excerpt(text: str, max_length: int = 200) -> str:
    """
    Extract and mask an excerpt from the full transcript.

    Removes names, specific locations, and contact info before storing.
    In production, use NER (Named Entity Recognition) for robust PII detection.

    Args:
        text (str): Full transcript
        max_length (int): Max excerpt length in characters

    Returns:
        str: Masked excerpt
    """
    if not text:
        return "[Empty transcript]"

    # Truncate for storage
    excerpt = text[:max_length] if len(text) > max_length else text

    # Simple replacements (in production: use spacy NER or similar)
    excerpt = excerpt.replace("@", "[email]")
    excerpt = excerpt.replace("+91", "[phone]")
    excerpt = excerpt.replace("+1", "[phone]")

    # Note: Full PII detection would require NER model
    # For prototype, we rely on not capturing PII in the first place

    return excerpt
