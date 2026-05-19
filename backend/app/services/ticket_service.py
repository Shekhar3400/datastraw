"""
Business logic layer for ticket operations.
Keeps routes thin and logic testable.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.models.models import Ticket, Note
from app.schemas.schemas import TicketCreate, TicketUpdate, AnalyticsOut


def _generate_ticket_id(db: Session) -> str:
    """
    Generate a sequential ticket ID in the format TKT-XXXX.
    Finds the highest existing numeric suffix and increments it.
    """
    last = (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .first()
    )
    if last and last.ticket_id:
        try:
            num = int(last.ticket_id.split("-")[1]) + 1
        except (IndexError, ValueError):
            num = 1
    else:
        num = 1
    return f"TKT-{num:04d}"


def create_ticket(db: Session, payload: TicketCreate) -> Ticket:
    """Create a new support ticket with an auto-generated ID."""
    ticket_id = _generate_ticket_id(db)
    ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        subject=payload.subject,
        description=payload.description,
        priority=payload.priority or "medium",
        status="open",
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_tickets(
    db: Session,
    status: Optional[str] = None,
    search: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[List[Ticket], int]:
    """
    Retrieve tickets with optional filtering and full-text search.
    Returns (tickets, total_count).
    """
    query = db.query(Ticket)

    # Status filter
    if status and status != "all":
        query = query.filter(Ticket.status == status)

    # Priority filter
    if priority and priority != "all":
        query = query.filter(Ticket.priority == priority)

    # Full-text search across multiple fields
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.ticket_id.ilike(term),
                Ticket.customer_name.ilike(term),
                Ticket.customer_email.ilike(term),
                Ticket.subject.ilike(term),
                Ticket.description.ilike(term),
            )
        )

    total = query.count()
    tickets = (
        query.order_by(Ticket.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return tickets, total


def get_ticket_by_id(db: Session, ticket_id: str) -> Optional[Ticket]:
    """Fetch a single ticket with its notes by ticket_id string."""
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def update_ticket(db: Session, ticket_id: str, payload: TicketUpdate) -> Optional[Ticket]:
    """
    Update ticket status/priority and optionally append a note.
    Returns None if ticket not found.
    """
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None

    if payload.status is not None:
        ticket.status = payload.status
    if payload.priority is not None:
        ticket.priority = payload.priority

    ticket.updated_at = datetime.utcnow()

    # Append note if provided
    if payload.note:
        note = Note(
            ticket_id=ticket.ticket_id,
            note_text=payload.note.note_text,
            author=payload.note.author or "Support Agent",
        )
        db.add(note)

    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket_id: str) -> bool:
    """Hard-delete a ticket and its notes. Returns True if deleted."""
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return False
    db.delete(ticket)
    db.commit()
    return True


def get_analytics(db: Session) -> AnalyticsOut:
    """Aggregate ticket counts for the analytics dashboard."""
    total = db.query(func.count(Ticket.id)).scalar()
    open_count = db.query(func.count(Ticket.id)).filter(Ticket.status == "open").scalar()
    in_progress = db.query(func.count(Ticket.id)).filter(Ticket.status == "in_progress").scalar()
    closed = db.query(func.count(Ticket.id)).filter(Ticket.status == "closed").scalar()
    high = db.query(func.count(Ticket.id)).filter(Ticket.priority == "high").scalar()
    urgent = db.query(func.count(Ticket.id)).filter(Ticket.priority == "urgent").scalar()

    return AnalyticsOut(
        total=total,
        open=open_count,
        in_progress=in_progress,
        closed=closed,
        high_priority=high,
        urgent_priority=urgent,
    )
