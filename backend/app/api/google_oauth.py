"""Google OAuth and Docs export endpoints."""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.database import get_db
from ..models import User
from ..services.google_docs import GoogleDocsService
from .dependencies import get_current_user
from .cv_export import get_user_cv_data

router = APIRouter()


def create_flow() -> Flow:
    """Create OAuth flow for Google authentication."""
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
            }
        },
        scopes=settings.GOOGLE_SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    return flow


@router.get("/auth/google/url")
async def get_google_auth_url(
    current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Generate Google OAuth authorization URL.

    Returns:
        Dictionary with authorization URL and state
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
        )

    flow = create_flow()
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )

    return {
        "authorization_url": authorization_url,
        "state": state
    }


@router.get("/auth/google/callback")
async def google_auth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback.

    This endpoint receives the authorization code from Google
    and exchanges it for access tokens.
    """
    try:
        flow = create_flow()
        flow.fetch_token(code=code)

        credentials = flow.credentials

        # Store credentials in session or database
        # For now, we'll return them to the frontend to store temporarily
        return {
            "success": True,
            "credentials": {
                "token": credentials.token,
                "refresh_token": credentials.refresh_token,
                "token_uri": credentials.token_uri,
                "client_id": credentials.client_id,
                "client_secret": credentials.client_secret,
                "scopes": credentials.scopes
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to authenticate with Google: {str(e)}"
        )


@router.post("/export/google-docs")
async def export_to_google_docs(
    credentials_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Export CV to Google Docs.

    Args:
        credentials_data: Google OAuth credentials from frontend
        current_user: Authenticated user
        db: Database session

    Returns:
        Dictionary with document ID and URL
    """
    try:
        # Reconstruct credentials from received data
        credentials = Credentials(
            token=credentials_data.get("token"),
            refresh_token=credentials_data.get("refresh_token"),
            token_uri=credentials_data.get("token_uri"),
            client_id=credentials_data.get("client_id"),
            client_secret=credentials_data.get("client_secret"),
            scopes=credentials_data.get("scopes")
        )

        # Get CV data
        cv_data = get_user_cv_data(current_user, db)

        # Create Google Docs service and export
        docs_service = GoogleDocsService(credentials)
        result = docs_service.create_cv_document(cv_data)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export to Google Docs: {str(e)}"
        )
