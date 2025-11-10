"""CV-related schemas."""
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class EducationBase(BaseModel):
    """Base education schema."""

    degree: str
    institution: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    details: Optional[List[str]] = []


class EducationCreate(EducationBase):
    """Schema for creating education entry."""

    pass


class EducationResponse(EducationBase):
    """Schema for education response."""

    id: int

    class Config:
        from_attributes = True


class ExperienceBase(BaseModel):
    """Base experience schema."""

    company: str
    role: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    bullets: List[str]


class ExperienceCreate(ExperienceBase):
    """Schema for creating experience entry."""

    pass


class ExperienceResponse(ExperienceBase):
    """Schema for experience response."""

    id: int

    class Config:
        from_attributes = True


class CertificationBase(BaseModel):
    """Base certification schema."""

    name: str
    issuer: str
    date: Optional[str] = None
    credential_id: Optional[str] = None
    url: Optional[str] = None


class CertificationCreate(CertificationBase):
    """Schema for creating certification."""

    pass


class CertificationResponse(CertificationBase):
    """Schema for certification response."""

    id: int
    file_path: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """Base project schema."""

    name: str
    impact: Optional[str] = None
    technologies: Optional[List[str]] = []
    url: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Schema for creating project."""

    pass


class ProjectResponse(ProjectBase):
    """Schema for project response."""

    id: int

    class Config:
        from_attributes = True


class SkillsBase(BaseModel):
    """Base skills schema."""

    languages: Optional[List[str]] = []
    tools: Optional[List[str]] = []
    methods: Optional[List[str]] = []


class SkillsCreate(SkillsBase):
    """Schema for creating/updating skills."""

    pass


class SkillsResponse(SkillsBase):
    """Schema for skills response."""

    id: int

    class Config:
        from_attributes = True


class ProfileBase(BaseModel):
    """Base profile schema."""

    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    summary: Optional[str] = None


class ProfileCreate(ProfileBase):
    """Schema for creating profile."""

    pass


class ProfileUpdate(ProfileBase):
    """Schema for updating profile."""

    pass


class ProfileResponse(ProfileBase):
    """Schema for profile response."""

    id: int
    user_id: int
    education: List[EducationResponse] = []
    experience: List[ExperienceResponse] = []
    certifications: List[CertificationResponse] = []
    projects: List[ProjectResponse] = []
    skills: Optional[SkillsResponse] = None

    class Config:
        from_attributes = True


class CVData(BaseModel):
    """Complete CV data for generation."""

    profile: ProfileBase
    education: List[EducationBase] = []
    experience: List[ExperienceBase] = []
    certifications: List[CertificationBase] = []
    projects: List[ProjectBase] = []
    skills: Optional[SkillsBase] = None
