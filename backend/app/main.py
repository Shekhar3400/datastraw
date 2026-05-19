"""
FastAPI application entry point.
Initialises the database, registers routes, and configures CORS.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database.database import engine, Base
from app.routes.tickets import router as tickets_router

# Import models so SQLAlchemy registers them before create_all
import app.models.models  # noqa: F401

load_dotenv()

# ─── Create tables ────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── App instance ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Support CRM API",
    description="Customer Support Ticketing System — REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(tickets_router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Support CRM API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
