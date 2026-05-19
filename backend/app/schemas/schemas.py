"""
Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, validator


# ─── Note Schemas ────────────────────────────────────────────────────────────

class NoteCreate(BaseModel):
    note_text: str = Field(..., min_length=1, max_length=2000)
    author: Optional[str] = Field("Support Agent", max_length=120)


class NoteOut(BaseModel):
    id: int
    ticket_id: str
    note_text: str
    author: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Ticket Schemas ───────────────────────────────────────────────────────────

class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=120)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=5000)
    priority: Optional[str] = Field("medium", pattern="^(low|medium|high|urgent)$")


class TicketUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(open|in_progress|closed)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high|urgent)$")
    note: Optional[NoteCreate] = None


class TicketSummary(BaseModel):
    """Lightweight ticket representation for list views."""
    id: int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TicketDetail(TicketSummary):
    """Full ticket with notes for detail view."""
    description: str
    notes: List[NoteOut] = []

    class Config:
        from_attributes = True


class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime
    message: str = "Ticket created successfully"


# ─── Analytics Schema ─────────────────────────────────────────────────────────

class AnalyticsOut(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int
    high_priority: int
    urgent_priority: int
