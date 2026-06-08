from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import get_settings

settings = get_settings()

bearer_scheme = HTTPBearer(auto_error=False)

import bcrypt

def hash_password(password: str) -> str:
    # Use native bcrypt to bypass broken passlib library.
    salt = bcrypt.gensalt()
    pwd_bytes = password.encode('utf-8')[:72]
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    try:
        plain_bytes = plain.encode('utf-8')[:72]
        hashed_bytes = hashed.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.jwt_expire_minutes))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

def decode_token(token: str) -> dict:
    try:
        import os
        secret = os.environ.get("SUPABASE_JWT_SECRET", getattr(settings, 'supabase_jwt_secret', settings.jwt_secret_key))
        if not secret:
            secret = settings.jwt_secret_key
            
        return jwt.decode(
            token, 
            secret, 
            algorithms=["HS256", "RS256", settings.jwt_algorithm], 
            options={"verify_aud": False}
        )
    except Exception as e:
        print(f"JWT Decode Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization required")
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return {"id": user_id, "role": payload.get("role", "candidate"), "email": payload.get("email")}

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

def require_role(*roles: str):
    async def checker(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in roles:
            raise HTTPException(status_code=403, detail=f"Access denied. Required: {list(roles)}")
        return user
    return checker

require_candidate = require_role("candidate")
require_company = require_role("company", "admin")
require_admin = require_role("admin")
