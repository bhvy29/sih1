"""
Psychiatrist Routes - Namespace: /api/psychiatrist

Endpoints for psychiatrist authentication, critical patient queue view,
case report review, status updating, and session notes.
"""

from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.db import get_db
from app.database.models import Case
from app.database.psychiatrist_models import Psychiatrist, QueueEntry, SessionNote
from app.services.psychiatrist_service import hash_password, seed_default_psychiatrist

router = APIRouter(prefix="/api/psychiatrist", tags=["psychiatrist"])


class LoginRequest(BaseModel):
    username: str
    password: str


class StatusUpdateRequest(BaseModel):
    status: str  # 'queued', 'in_session', 'resolved'
    psychiatrist_id: Optional[int] = None


class SessionNoteRequest(BaseModel):
    psychiatrist_id: Optional[int] = None
    psychiatrist_name: Optional[str] = "Dr. Psychiatrist"
    notes: str


@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate psychiatrist."""
    # Ensure default user exists
    seed_default_psychiatrist(db)

    user = db.query(Psychiatrist).filter(Psychiatrist.username == request.username).first()
    if not user or user.password_hash != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "status": "success",
        "message": "Login successful",
        "psychiatrist": user.to_dict(),
        "token": f"mock-token-{user.id}-{int(datetime.utcnow().timestamp())}",
    }


@router.get("/queue")
async def get_critical_queue(
    status: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    db: Session = Depends(get_db)
):
    """
    Get queue of critical patients sorted by wait time (created_at asc) or severity (svi_score desc).
    Returns list of queue entries along with in-app notification count for pending cases.
    """
    query = db.query(QueueEntry)
    if status:
        query = query.filter(QueueEntry.status == status)

    if sort_by == "svi_score":
        entries = query.order_by(QueueEntry.svi_score.desc()).all()
    else:
        entries = query.order_by(QueueEntry.created_at.asc()).all()

    queued_count = db.query(QueueEntry).filter(QueueEntry.status == "queued").count()
    in_session_count = db.query(QueueEntry).filter(QueueEntry.status == "in_session").count()
    resolved_count = db.query(QueueEntry).filter(QueueEntry.status == "resolved").count()

    return {
        "entries": [entry.to_dict() for entry in entries],
        "queued_count": queued_count,
        "in_session_count": in_session_count,
        "resolved_count": resolved_count,
        "total_critical": len(entries),
    }


@router.patch("/queue/{case_id}/status")
async def update_queue_status(
    case_id: str,
    body: StatusUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update status of a queued patient ('in_session' or 'resolved')."""
    if body.status not in ["queued", "in_session", "resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status option")

    entry = db.query(QueueEntry).filter(QueueEntry.case_id == case_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    entry.status = body.status
    if body.psychiatrist_id:
        entry.assigned_psychiatrist_id = body.psychiatrist_id
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)

    return {"status": "success", "queue_entry": entry.to_dict()}


@router.get("/cases/{case_id}/report")
async def get_case_report_for_psychiatrist(case_id: str, db: Session = Depends(get_db)):
    """Fetch full AI report and breakdown for a patient before or during session."""
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    queue_entry = db.query(QueueEntry).filter(QueueEntry.case_id == case_id).first()

    return {
        "case": case.to_dict(),
        "queue_status": queue_entry.status if queue_entry else "not_queued",
    }


@router.post("/cases/{case_id}/notes")
async def add_session_notes(
    case_id: str,
    body: SessionNoteRequest,
    db: Session = Depends(get_db)
):
    """Save free-text session notes against a patient's record."""
    note = SessionNote(
        case_id=case_id,
        psychiatrist_id=body.psychiatrist_id,
        psychiatrist_name=body.psychiatrist_name or "Dr. Psychiatrist",
        notes=body.notes,
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    return {"status": "success", "note": note.to_dict()}


@router.get("/cases/{case_id}/notes")
async def get_session_notes(case_id: str, db: Session = Depends(get_db)):
    """Retrieve session notes history for a patient."""
    notes = db.query(SessionNote).filter(SessionNote.case_id == case_id).order_by(SessionNote.created_at.desc()).all()
    return {"notes": [n.to_dict() for n in notes]}
