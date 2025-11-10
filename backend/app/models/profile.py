"""Profile and CV-related models."""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from ..core.database import Base


class Profile(Base):
    """User profile information."""

    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Personal Information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    location = Column(String)
    linkedin = Column(String)
    summary = Column(Text)

    # Relationships
    user = relationship("User", back_populates="profile")
    education = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    experience = relationship("Experience", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="profile", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="profile", cascade="all, delete-orphan")
    skills = relationship("Skills", back_populates="profile", uselist=False, cascade="all, delete-orphan")


class Education(Base):
    """Education entries."""

    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)

    degree = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    location = Column(String)
    start_date = Column(String)  # YYYY-MM format
    end_date = Column(String)  # YYYY-MM format or null for current
    details = Column(JSON)  # List of achievement bullets

    profile = relationship("Profile", back_populates="education")


class Experience(Base):
    """Work experience entries."""

    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)

    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    location = Column(String)
    start_date = Column(String, nullable=False)  # YYYY-MM format
    end_date = Column(String)  # YYYY-MM format or null for current
    bullets = Column(JSON, nullable=False)  # List of impact bullets

    profile = relationship("Profile", back_populates="experience")


class Certification(Base):
    """Certifications."""

    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)

    name = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    date = Column(String)  # YYYY-MM format
    credential_id = Column(String)
    url = Column(String)
    file_path = Column(String)  # Path to uploaded certificate file

    profile = relationship("Profile", back_populates="certifications")


class Project(Base):
    """Projects."""

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)

    name = Column(String, nullable=False)
    impact = Column(Text)
    technologies = Column(JSON)  # List of technologies
    url = Column(String)

    profile = relationship("Profile", back_populates="projects")


class Skills(Base):
    """Skills organized by category."""

    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), unique=True, nullable=False)

    languages = Column(JSON)  # List of programming languages
    tools = Column(JSON)  # List of tools
    methods = Column(JSON)  # List of methodologies

    profile = relationship("Profile", back_populates="skills")
