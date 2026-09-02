"""
Psychiatrist Module Database Models

Models for SQLite database managing:
- Psychiatrist user accounts
- Patient critical queue entries
- Session notes
- Live consultation chat messages
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from datetime import datetime
from app.database.models import Base


class Psychiatrist(Base):
    """Authenticated psychiatrist accounts."""
    __tablename__ = "psychiatrists"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    role = Column(String, default="psychiatrist")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class QueueEntry(Base):
    """Queue of critical SVI cases awaiting psychiatrist attention."""
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    svi_score = Column(Float, nullable=False)
    category = Column(String, default="Critical")
    status = Column(String, default="queued", index=True)  # queued, in_session, resolved
    assigned_psychiatrist_id = Column(Integer, ForeignKey("psychiatrists.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id,
            "svi_score": self.svi_score,
            "category": self.category,
            "status": self.status,
            "assigned_psychiatrist_id": self.assigned_psychiatrist_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class SessionNote(Base):
    """Free-text notes added by psychiatrists during or after a patient session."""
    __tablename__ = "session_notes"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, index=True, nullable=False)
    psychiatrist_id = Column(Integer, nullable=True)
    psychiatrist_name = Column(String, default="Psychiatrist")
    notes = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id,
            "psychiatrist_id": self.psychiatrist_id,
            "psychiatrist_name": self.psychiatrist_name,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class ChatMessage(Base):
    """Text-based chat messages between patient and psychiatrist for a case."""
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, index=True, nullable=False)
    sender_type = Column(String, nullable=False)  # 'patient' or 'psychiatrist'
    sender_name = Column(String, default="User")
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id,
            "sender_type": self.sender_type,
            "sender_name": self.sender_name,
            "message": self.message,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
