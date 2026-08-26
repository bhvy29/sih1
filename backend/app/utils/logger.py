"""
Logger Utility - Structured logging for debugging and audit

Returns JSON-formatted log entries for easy parsing and storage.
"""

import json
from datetime import datetime


def log_event(event_type: str, details: dict, level: str = "INFO"):
    """
    Log a structured event.

    Args:
        event_type (str): e.g., "assessment_submitted", "case_reviewed"
        details (dict): Event metadata
        level (str): "INFO", "WARNING", "ERROR"
    """
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "level": level,
        "event_type": event_type,
        "details": details,
    }
    # In production: send to logging service (Datadog, CloudWatch, etc.)
    # For now: print as JSON
    print(json.dumps(log_entry))
    return log_entry
