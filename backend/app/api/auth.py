"""Authentication endpoints."""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token, generate_reset_token
from ..models import User, Profile
from ..schemas import UserCreate, UserLogin, Token, PasswordResetRequest, PasswordReset, Message

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return token."""
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", response_model=Message)
def logout():
    """Logout user (client should delete token)."""
    return {"message": "Successfully logged out. Please delete your access token."}


@router.post("/password-reset-request", response_model=Message)
def request_password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """Request a password reset token."""
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()

    # Always return success message to prevent email enumeration
    if not user:
        return {"message": "If your email is registered, you will receive a password reset link."}

    # Generate reset token
    reset_token = generate_reset_token()
    reset_token_expires = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour

    # Save token to database
    user.reset_token = reset_token
    user.reset_token_expires = reset_token_expires
    db.commit()

    # In a production environment, you would send an email here
    # For now, we'll just return the token in the response (ONLY FOR DEVELOPMENT)
    # TODO: Implement email sending in production
    print(f"Password reset token for {user.email}: {reset_token}")

    return {"message": "If your email is registered, you will receive a password reset link."}


@router.post("/password-reset", response_model=Message)
def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Reset password using the provided token."""
    # Find user with matching token
    user = db.query(User).filter(User.reset_token == reset_data.token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Check if token has expired
    if not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"message": "Password successfully reset. You can now login with your new password."}
