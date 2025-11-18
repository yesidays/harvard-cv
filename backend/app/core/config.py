"""Application configuration settings."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Harvard CV Generator"
    VERSION: str = "1.0.0"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = "sqlite:///./harvard_cv.db"

    # File Upload
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5 MB
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_EXTENSIONS: set = {".pdf", ".jpg", ".jpeg", ".png"}

    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    # Templates
    TEMPLATES_DIR: str = "./app/templates"

    # Google OAuth & Docs
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:5173/auth/google/callback"
    GOOGLE_SCOPES: list = [
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/drive.file"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
