"""
Ticket API routes.
All endpoints are prefixed with /api/tickets via main.py router inclusion.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.schemas import (
    TicketCreate,
    TicketUpdate,
    TicketSummary,
    TicketDetail,
    TicketCreateResponse,
    AnalyticsOut,
)
from app.services import ticket_service

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


@router.post("", response_model=TicketCreateResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    """
    Create a new support ticket.
    Auto-generates a unique TKT-XXXX identifier.
    """
    ticket = ticket_service.create_ticket(db, payload)
    return TicketCreateResponse(ticket_id=ticket.ticket_id, created_at=ticket.created_at)


@router.get("", response_model=dict)
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by status: open | in_progress | closed"),
    priority: Optional[str] = Query(None, description="Filter by priority: low | medium | high | urgent"),
    search: Optional[str] = Query(None, description="Search across ID, name, email, subject, description"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    List tickets with optional status/priority filtering and full-text search.
    Supports pagination via page + limit query params.
    """
    skip = (page - 1) * limit
    tickets, total = ticket_service.get_tickets(
        db, status=status, search=search, priority=priority, skip=skip, limit=limit
    )
    return {
        "data": [TicketSummary.from_orm(t) for t in tickets],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/analytics", response_model=AnalyticsOut)
def get_analytics(db: Session = Depends(get_db)):
    """Return aggregated ticket counts for the analytics dashboard."""
    return ticket_service.get_analytics(db)


@router.get("/{ticket_id}", response_model=TicketDetail)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Fetch a single ticket with all its notes."""
    ticket = ticket_service.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return ticket


@router.put("/{ticket_id}", response_model=TicketDetail)
def update_ticket(ticket_id: str, payload: TicketUpdate, db: Session = Depends(get_db)):
    """
    Update ticket status/priority and optionally add a note.
    Body fields are all optional — send only what you want to change.
    """
    ticket = ticket_service.update_ticket(db, ticket_id, payload)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return ticket


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Permanently delete a ticket and all its notes."""
    deleted = ticket_service.delete_ticket(db, ticket_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
