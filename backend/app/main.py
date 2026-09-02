"""
SahAI - FastAPI Backend
AI-based real-time stress and trauma assessment for NHAA 14566

Main application entry point. Initializes FastAPI, middleware, routes, and database.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import FRONTEND_URL, DEBUG
from app.routes import intake, dashboard, psychiatrist, chat
from app.database.db import engine
from app.database.models import Base
import app.database.psychiatrist_models  # Ensures psychiatrist models are registered with Base metadata

# Create FastAPI app
app = FastAPI(
    title="SahAI",
    description="AI-based stress and trauma assessment for NHAA 14566",
    version="0.1.0",
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database initialized")


# Register routes
app.include_router(intake.router)
app.include_router(dashboard.router)
app.include_router(psychiatrist.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "message": "SahAI Backend - AI Stress & Trauma Assessment for NHAA 14566",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=DEBUG,
    )
