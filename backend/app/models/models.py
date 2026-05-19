"""
SQLAlchemy ORM models for Tickets and Notes.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class Ticket(Base):
    """Represents a customer support ticket."""
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g. TKT-001
    customer_name = Column(String(120), nullable=False)
    customer_email = Column(String(200), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="open")  # open | in_progress | closed
    priority = Column(String(20), nullable=False, default="medium")  # low | medium | high | urgent
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to notes
    notes = relationship("Note", back_populates="ticket", cascade="all, delete-orphan")


class Note(Base):
    """Represents an internal note/comment on a ticket."""
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(20), ForeignKey("tickets.ticket_id"), nullable=False, index=True)
    note_text = Column(Text, nullable=False)
    author = Column(String(120), nullable=False, default="Support Agent")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to ticket
    ticket = relationship("Ticket", back_populates="notes")
