"""
Psychiatrist Connect Service

Handles:
- Automatic trigger/routing of patients after SVI assessment
- Routing non-critical patients to future RAG chatbot integration point
- Critical patient queue management
- Psychiatrist session notes management
"""

import hashlib
from sqlalchemy.orm import Session
from app.config.settings import ENABLE_PSYCHIATRIST_MODULE, CRITICAL_THRESHOLD
from app.database.psychiatrist_models import Psychiatrist, QueueEntry, SessionNote
from app.utils.logger import log_event


def hash_password(password: str) -> str:
    """Simple SHA256 password hash for demonstration."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def seed_default_psychiatrist(db: Session):
    """Seed default psychiatrist account if none exists."""
    existing = db.query(Psychiatrist).first()
    if not existing:
        default_psych = Psychiatrist(
            username="psychiatrist",
            password_hash=hash_password("admin123"),
            full_name="Dr. Sarah Jenkins (Lead Psychiatrist)",
            email="psychiatrist@sahai.org",
            role="psychiatrist",
            is_active=True,
        )
        db.add(default_psych)
        db.commit()
        db.refresh(default_psych)
        log_event("psychiatrist_seeded", {"username": "psychiatrist"})
        return default_psych
    return existing


def route_non_critical_patient(case_id: str, svi_score: float, category: str):
    """
    CLEAN INTEGRATION POINT FOR NON-CRITICAL PATIENTS.
    
    This function is invoked for patients whose SVI score is below CRITICAL_THRESHOLD.
    In future releases, this hook will route the patient to a separate RAG Chatbot module.
    Currently acts as a logged no-op to ensure non-critical patients pass through cleanly.
    """
    log_event(
        "non_critical_routing_hook",
        {
            "case_id": case_id,
            "svi_score": svi_score,
            "category": category,
            "target": "rag_chatbot_stub",
        },
    )
    return {"status": "routed_to_rag_chatbot_stub", "case_id": case_id}


def process_patient_routing(case_id: str, svi_score: float, category: str, db: Session) -> dict:
    """
    Trigger function called after SVI calculation.
    
    If ENABLE_PSYCHIATRIST_MODULE is True and (svi_score >= CRITICAL_THRESHOLD or category == 'Critical'):
        - Flags patient as critical
        - Inserts into queue_entries table
    Else:
        - Invokes route_non_critical_patient hook
    """
    if not ENABLE_PSYCHIATRIST_MODULE:
        return {"is_critical": False, "reason": "module_disabled"}

    is_critical = (svi_score >= CRITICAL_THRESHOLD) or (category == "Critical")

    if is_critical:
        # Check if already in queue
        existing_entry = db.query(QueueEntry).filter(QueueEntry.case_id == case_id).first()
        if not existing_entry:
            queue_entry = QueueEntry(
                case_id=case_id,
                svi_score=svi_score,
                category=category,
                status="queued",
            )
            db.add(queue_entry)
            db.commit()
            log_event(
                "patient_enqueued_critical",
                {"case_id": case_id, "svi_score": svi_score, "category": category},
            )
        return {"is_critical": True, "case_id": case_id}
    else:
        # Route to non-critical handler (stub for RAG chatbot)
        route_non_critical_patient(case_id, svi_score, category)
        return {"is_critical": False, "case_id": case_id}
