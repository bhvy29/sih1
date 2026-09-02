"""
Consultation Chat Routes - Namespace: /api/chat

Polling-based consultation chat endpoints between patient and assigned psychiatrist.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.db import get_db
from app.database.psychiatrist_models import ChatMessage

router = APIRouter(prefix="/api/chat", tags=["chat"])


class SendMessageRequest(BaseModel):
    case_id: str
    sender_type: str  # 'patient' or 'psychiatrist'
    sender_name: Optional[str] = "User"
    message: str


@router.post("/send")
async def send_message(body: SendMessageRequest, db: Session = Depends(get_db)):
    """Send a chat message for a consultation session."""
    if not body.message or not body.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    if body.sender_type not in ["patient", "psychiatrist"]:
        raise HTTPException(status_code=400, detail="Invalid sender_type")

    msg = ChatMessage(
        case_id=body.case_id,
        sender_type=body.sender_type,
        sender_name=body.sender_name or ("Patient" if body.sender_type == "patient" else "Psychiatrist"),
        message=body.message.strip(),
        timestamp=datetime.utcnow(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {"status": "success", "message": msg.to_dict()}


@router.get("/messages/{case_id}")
async def get_messages(case_id: str, db: Session = Depends(get_db)):
    """Retrieve chat history for a case."""
    messages = db.query(ChatMessage).filter(ChatMessage.case_id == case_id).order_by(ChatMessage.timestamp.asc()).all()
    return {
        "case_id": case_id,
        "messages": [m.to_dict() for m in messages],
        "count": len(messages),
    }
