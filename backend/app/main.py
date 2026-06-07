import uuid
import httpx
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import io
import PyPDF2

from groq import Groq
import json

from app.config import get_settings
from app.auth import hash_password, verify_password, create_access_token, get_current_user, require_candidate
from app.services import ai, ats_engine, trust_score, fraud, vector, resume_parser

settings = get_settings()

app = FastAPI(
    title="Placify API",
    description="Backend for Placify Hiring Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def supabase_headers():
    return {
        "apikey": settings.supabase_service_key,
        "Authorization": f"Bearer {settings.supabase_service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def supabase_url(table: str):
    return f"{settings.supabase_url}/rest/v1/{table}"

# --- MODELS ---
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "candidate"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class ProfileUpdate(BaseModel):
    headline: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    notice_period_days: Optional[int] = None

# --- AUTH ENDPOINTS ---
@app.post("/api/auth/register", tags=["Auth"], response_model=TokenResponse)
async def register(req: RegisterRequest):
    async with httpx.AsyncClient() as client:
        # Check if user exists
        check_resp = await client.get(
            f"{supabase_url('users')}?email=eq.{req.email}&select=id",
            headers=supabase_headers()
        )
        if check_resp.status_code == 200 and len(check_resp.json()) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create user
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(req.password)
        
        user_data = {
            "id": user_id,
            "email": req.email,
            "password_hash": hashed_password,
            "role": req.role,
            "name": req.full_name
        }
        
        create_resp = await client.post(
            supabase_url('users'),
            headers=supabase_headers(),
            json=user_data
        )
        
        if create_resp.status_code not in (200, 201):
            raise HTTPException(status_code=500, detail=f"Database error: {create_resp.text}")
            
        created_user = create_resp.json()[0]
        
        # If candidate, create candidate record
        if req.role == "candidate":
            cand_id = str(uuid.uuid4())
            cand_data = {
                "id": cand_id,
                "user_id": user_id,
                "profile_completion_pct": 20,
                "trust_score": 5.0
            }
            await client.post(
                supabase_url('candidates'),
                headers=supabase_headers(),
                json=cand_data
            )

        token = create_access_token(data={"sub": user_id, "email": req.email, "role": req.role})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": req.email,
                "name": req.full_name,
                "role": req.role
            }
        }

@app.post("/api/auth/login", tags=["Auth"], response_model=TokenResponse)
async def login(req: LoginRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{supabase_url('users')}?email=eq.{req.email}&select=*",
            headers=supabase_headers()
        )
        users = resp.json()
        if not users:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        user = users[0]
        
        if "password_hash" in user and user["password_hash"]:
            if not verify_password(req.password, user["password_hash"]):
                raise HTTPException(status_code=401, detail="Invalid email or password")
                
        token = create_access_token(data={"sub": user["id"], "email": user["email"], "role": user.get("role", "candidate")})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user.get("name", ""),
                "role": user.get("role", "candidate")
            }
        }

@app.get("/api/auth/me", tags=["Auth"])
async def get_me(user: dict = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{supabase_url('users')}?id=eq.{user['id']}&select=*",
            headers=supabase_headers()
        )
        if not resp.json():
            raise HTTPException(status_code=404, detail="User not found")
        return resp.json()[0]

# --- CANDIDATE ENDPOINTS ---
@app.post("/api/resume/parse-public", tags=["Candidate"])
async def parse_resume_public(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # Parse PDF
        text = ""
        try:
            pdf = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not read PDF file: {e}")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text. Please ensure it is a text-based PDF, not an image.")
            
        # Use Groq to extract details
        if not settings.groq_api_key:
            return {
                "status": "success",
                "extracted_data": {
                    "fullName": "Alex Montgomery",
                    "email": "alex.m@example.design",
                    "headline": "Senior Product Designer",
                    "skills": "React, TypeScript, Figma, UI/UX",
                    "location": "San Francisco, CA"
                }
            }
            
        client = Groq(api_key=settings.groq_api_key)
        
        prompt = f'''
        Extract the following information from the resume text below and return ONLY a valid JSON object. Do not include any markdown formatting like ```json. 
        Required keys:
        - fullName (string)
        - email (string)
        - headline (string, a short professional summary or current title)
        - skills (string, a comma-separated list of top skills)
        - location (string, City, State or Country)
        
        Resume Text:
        {text[:8000]}
        '''
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        response_text = completion.choices[0].message.content
        extracted_data = json.loads(response_text)
        
        return {
            "status": "success",
            "extracted_data": extracted_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")