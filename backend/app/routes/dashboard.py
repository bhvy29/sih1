"""
Dashboard Routes - Counsellor case review and management

GET /cases: Fetch all cases sorted by risk level (Critical first)
PATCH /cases/{case_id}/review: Mark case as reviewed by counsellor
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.db import get_db
from app.database.models import Case, AuditLog
from app.utils.logger import log_event
from datetime import datetime

router = APIRouter(prefix="/api", tags=["dashboard"])


class CaseResponse(BaseModel):
    """Case summary for dashboard display."""
    case_id: str
    created_at: str
    language: str
    svi_score: float
    category: str
    transcript_excerpt: str
    recommended_action: str
    reviewed_by: str = None
    reviewed_at: str = None


class CasesListResponse(BaseModel):
    """Paginated list of cases."""
    cases: list[CaseResponse]
    total: int
    limit: int
    offset: int


class MarkReviewedRequest(BaseModel):
    """Request to mark a case as reviewed."""
    reviewed_by: str  # Counsellor name or ID


@router.get("/cases", response_model=CasesListResponse)
async def get_cases(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    category: str = Query(None),  # Filter by category (optional)
) -> CasesListResponse:
    """
    Fetch all cases sorted by SVI score (Critical cases pinned to top).

    Query params:
    - limit: Number of cases to return (max 500)
    - offset: Pagination offset
    - category: Filter by risk category (optional)

    Returns:
    - cases: List of case summaries (anonymized IDs, no raw audio)
    - total: Total number of cases
    - limit, offset: For pagination
    """

    query = db.query(Case)

    # Filter by category if provided
    if category:
        query = query.filter(Case.category == category)

    # Sort: Critical first (desc), then by SVI score (desc), then by timestamp (desc)
    query = query.order_by(
        desc(Case.category == "Critical"),  # Booleans sort as True=1, False=0
        desc(Case.svi_score),
        desc(Case.created_at),
    )

    total = query.count()

    # Paginate
    cases = query.offset(offset).limit(limit).all()

    return CasesListResponse(
        cases=[
            CaseResponse(
                case_id=case.case_id,
                created_at=case.created_at.isoformat(),
                language=case.language,
                svi_score=case.svi_score,
                category=case.category,
                transcript_excerpt=case.transcript_excerpt,
                recommended_action=case.recommended_action,
                reviewed_by=case.reviewed_by,
                reviewed_at=case.reviewed_at.isoformat() if case.reviewed_at else None,
            )
            for case in cases
        ],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/cases/critical-count")
async def get_critical_count(db: Session = Depends(get_db)):
    """Get count of unreviewed Critical cases for alert badge."""
    critical_unreviewed = (
        db.query(Case)
        .filter(Case.category == "Critical", Case.reviewed_by.is_(None))
        .count()
    )
    return {"critical_count": critical_unreviewed}


@router.patch("/cases/{case_id}/review")
async def mark_case_reviewed(
    case_id: str,
    request_data: MarkReviewedRequest,
    db: Session = Depends(get_db),
    req: Request = None,
):
    """
    Mark a case as reviewed by a counsellor.

    Creates an audit log entry for accountability.

    Args:
    - case_id: Anonymized case ID
    - reviewed_by: Counsellor name/ID
    """

    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Update case
    case.reviewed_by = request_data.reviewed_by
    case.reviewed_at = datetime.utcnow()
    db.add(case)

    # Create audit log entry
    audit_log = AuditLog(
        case_id=case_id,
        action="reviewed",
        actor_name=request_data.reviewed_by,
        details={
            "previous_status": "unreviewed",
            "new_status": "reviewed",
            "client_ip": req.client.host if req else None,
        },
    )
    db.add(audit_log)
    db.commit()

    log_event(
        "case_marked_reviewed",
        {
            "case_id": case_id,
            "reviewed_by": request_data.reviewed_by,
            "category": case.category,
        },
    )

    return {
        "success": True,
        "case_id": case_id,
        "reviewed_by": request_data.reviewed_by,
        "reviewed_at": case.reviewed_at.isoformat(),
    }
