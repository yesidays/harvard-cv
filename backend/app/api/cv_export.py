"""CV data endpoints for frontend rendering."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import User, Profile
from .dependencies import get_current_user

router = APIRouter(prefix="/cv", tags=["cv-data"])


def get_user_cv_data(user: User, db: Session) -> dict:
    """Get complete CV data for user."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please create a profile first.",
        )

    # Convert SQLAlchemy models to dictionaries
    cv_data = {
        "profile": {
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "email": profile.email,
            "phone": profile.phone,
            "location": profile.location,
            "linkedin": profile.linkedin,
            "summary": profile.summary,
        },
        "education": [
            {
                "degree": edu.degree,
                "institution": edu.institution,
                "location": edu.location,
                "start_date": edu.start_date,
                "end_date": edu.end_date,
                "details": edu.details or [],
            }
            for edu in profile.education
        ],
        "experience": [
            {
                "company": exp.company,
                "role": exp.role,
                "location": exp.location,
                "start_date": exp.start_date,
                "end_date": exp.end_date,
                "bullets": exp.bullets or [],
            }
            for exp in profile.experience
        ],
        "certifications": [
            {
                "name": cert.name,
                "issuer": cert.issuer,
                "date": cert.date,
                "credential_id": cert.credential_id,
                "url": cert.url,
            }
            for cert in profile.certifications
        ],
        "projects": [
            {
                "name": proj.name,
                "impact": proj.impact,
                "technologies": proj.technologies or [],
                "url": proj.url,
            }
            for proj in profile.projects
        ],
        "skills": (
            {
                "languages": profile.skills.languages or [],
                "tools": profile.skills.tools or [],
                "methods": profile.skills.methods or [],
            }
            if profile.skills
            else None
        ),
    }

    return cv_data


@router.get("/data")
def get_cv_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get complete CV data in JSON format for frontend rendering and export."""
    cv_data = get_user_cv_data(current_user, db)
    return cv_data
