from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

Base = declarative_base()


class Case(Base):
    """Store assessment cases with anonymized data and risk scores."""
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True)  # Anonymized ID
    created_at = Column(DateTime, default=datetime.utcnow)
    language = Column(String, default="en")  # 'en' or 'hi'
    transcript_excerpt = Column(String)  # Only excerpt, not full text
    svi_score = Column(Float)  # Stress Vulnerability Index (0-100)
    category = Column(String)  # "Low", "Moderate", "High", "Critical"
    recommended_action = Column(String)
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_ip = Column(String, nullable=True)
    analysis_breakdown = Column(JSON)  # Store sentiment, emotion, crisis scores
    ai_report = Column(Text, nullable=True)  # Grok-generated narrative summary for counsellors

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id,
            "created_at": self.created_at.isoformat(),
            "language": self.language,
            "transcript_excerpt": self.transcript_excerpt,
            "svi_score": self.svi_score,
            "category": self.category,
            "recommended_action": self.recommended_action,
            "reviewed_by": self.reviewed_by,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
            "analysis_breakdown": self.analysis_breakdown,
            "ai_report": self.ai_report,
        }


class AuditLog(Base):
    """Track who reviewed which cases and when (accountability)."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, index=True)  # Reference to case (not FK for simplicity)
    action = Column(String)  # "reviewed", "escalated", etc.
    actor_name = Column(String)  # Counsellor/admin name
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON)  # Extra metadata as JSON

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id,
            "action": self.action,
            "actor_name": self.actor_name,
            "timestamp": self.timestamp.isoformat(),
            "details": self.details,
        }
