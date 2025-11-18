"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api import auth, profile, cv_data, cv_export, google_oauth

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Generate professional CVs in Harvard format",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(cv_data.router, prefix=settings.API_V1_STR)
app.include_router(cv_export.router, prefix=settings.API_V1_STR)
app.include_router(google_oauth.router, prefix=settings.API_V1_STR, tags=["google"])


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Harvard CV Generator API",
        "version": settings.VERSION,
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
