"""CV data management endpoints (experience, education, etc.)."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import User, Profile, Education, Experience, Certification, Project, Skills
from ..schemas import (
    EducationCreate,
    EducationResponse,
    ExperienceCreate,
    ExperienceResponse,
    CertificationCreate,
    CertificationResponse,
    ProjectCreate,
    ProjectResponse,
    SkillsCreate,
    SkillsResponse,
)
from .dependencies import get_current_user

router = APIRouter(tags=["cv-data"])


def get_user_profile(user_id: int, db: Session) -> Profile:
    """Helper to get user profile or raise 404."""
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please create a profile first.",
        )
    return profile


# ===== EDUCATION ENDPOINTS =====
@router.get("/education", response_model=List[EducationResponse])
def get_education(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all education entries."""
    profile = get_user_profile(current_user.id, db)
    return profile.education


@router.post(
    "/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED
)
def create_education(
    education_data: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create education entry."""
    profile = get_user_profile(current_user.id, db)
    new_education = Education(**education_data.model_dump(), profile_id=profile.id)
    db.add(new_education)
    db.commit()
    db.refresh(new_education)
    return new_education


@router.put("/education/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: int,
    education_data: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update education entry."""
    profile = get_user_profile(current_user.id, db)
    education = (
        db.query(Education)
        .filter(Education.id == education_id, Education.profile_id == profile.id)
        .first()
    )
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education entry not found",
        )

    for field, value in education_data.model_dump().items():
        setattr(education, field, value)

    db.commit()
    db.refresh(education)
    return education


@router.delete("/education/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    education_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete education entry."""
    profile = get_user_profile(current_user.id, db)
    education = (
        db.query(Education)
        .filter(Education.id == education_id, Education.profile_id == profile.id)
        .first()
    )
    if education:
        db.delete(education)
        db.commit()
    return None


# ===== EXPERIENCE ENDPOINTS =====
@router.get("/experience", response_model=List[ExperienceResponse])
def get_experience(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all experience entries."""
    profile = get_user_profile(current_user.id, db)
    return profile.experience


@router.post(
    "/experience", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED
)
def create_experience(
    experience_data: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create experience entry."""
    profile = get_user_profile(current_user.id, db)
    new_experience = Experience(**experience_data.model_dump(), profile_id=profile.id)
    db.add(new_experience)
    db.commit()
    db.refresh(new_experience)
    return new_experience


@router.put("/experience/{experience_id}", response_model=ExperienceResponse)
def update_experience(
    experience_id: int,
    experience_data: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update experience entry."""
    profile = get_user_profile(current_user.id, db)
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id, Experience.profile_id == profile.id)
        .first()
    )
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience entry not found",
        )

    for field, value in experience_data.model_dump().items():
        setattr(experience, field, value)

    db.commit()
    db.refresh(experience)
    return experience


@router.delete("/experience/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete experience entry."""
    profile = get_user_profile(current_user.id, db)
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id, Experience.profile_id == profile.id)
        .first()
    )
    if experience:
        db.delete(experience)
        db.commit()
    return None


# ===== CERTIFICATION ENDPOINTS =====
@router.get("/certifications", response_model=List[CertificationResponse])
def get_certifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all certifications."""
    profile = get_user_profile(current_user.id, db)
    return profile.certifications


@router.post(
    "/certifications",
    response_model=CertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certification(
    certification_data: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create certification."""
    profile = get_user_profile(current_user.id, db)
    new_certification = Certification(
        **certification_data.model_dump(), profile_id=profile.id
    )
    db.add(new_certification)
    db.commit()
    db.refresh(new_certification)
    return new_certification


@router.put("/certifications/{certification_id}", response_model=CertificationResponse)
def update_certification(
    certification_id: int,
    certification_data: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update certification."""
    profile = get_user_profile(current_user.id, db)
    certification = (
        db.query(Certification)
        .filter(
            Certification.id == certification_id,
            Certification.profile_id == profile.id,
        )
        .first()
    )
    if not certification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certification not found",
        )

    for field, value in certification_data.model_dump().items():
        setattr(certification, field, value)

    db.commit()
    db.refresh(certification)
    return certification


@router.delete(
    "/certifications/{certification_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_certification(
    certification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete certification."""
    profile = get_user_profile(current_user.id, db)
    certification = (
        db.query(Certification)
        .filter(
            Certification.id == certification_id,
            Certification.profile_id == profile.id,
        )
        .first()
    )
    if certification:
        db.delete(certification)
        db.commit()
    return None


# ===== PROJECT ENDPOINTS =====
@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all projects."""
    profile = get_user_profile(current_user.id, db)
    return profile.projects


@router.post(
    "/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED
)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create project."""
    profile = get_user_profile(current_user.id, db)
    new_project = Project(**project_data.model_dump(), profile_id=profile.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update project."""
    profile = get_user_profile(current_user.id, db)
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.profile_id == profile.id)
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    for field, value in project_data.model_dump().items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete project."""
    profile = get_user_profile(current_user.id, db)
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.profile_id == profile.id)
        .first()
    )
    if project:
        db.delete(project)
        db.commit()
    return None


# ===== SKILLS ENDPOINTS =====
@router.get("/skills", response_model=SkillsResponse)
def get_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get skills."""
    profile = get_user_profile(current_user.id, db)
    if not profile.skills:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skills not found",
        )
    return profile.skills


@router.post(
    "/skills", response_model=SkillsResponse, status_code=status.HTTP_201_CREATED
)
def create_skills(
    skills_data: SkillsCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create skills."""
    profile = get_user_profile(current_user.id, db)

    # Check if skills already exist
    if profile.skills:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skills already exist. Use PUT to update.",
        )

    new_skills = Skills(**skills_data.model_dump(), profile_id=profile.id)
    db.add(new_skills)
    db.commit()
    db.refresh(new_skills)
    return new_skills


@router.put("/skills", response_model=SkillsResponse)
def update_skills(
    skills_data: SkillsCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update skills."""
    profile = get_user_profile(current_user.id, db)

    if not profile.skills:
        # Create if doesn't exist
        new_skills = Skills(**skills_data.model_dump(), profile_id=profile.id)
        db.add(new_skills)
        db.commit()
        db.refresh(new_skills)
        return new_skills

    # Update existing
    for field, value in skills_data.model_dump().items():
        setattr(profile.skills, field, value)

    db.commit()
    db.refresh(profile.skills)
    return profile.skills


@router.delete("/skills", status_code=status.HTTP_204_NO_CONTENT)
def delete_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete skills."""
    profile = get_user_profile(current_user.id, db)
    if profile.skills:
        db.delete(profile.skills)
        db.commit()
    return None
