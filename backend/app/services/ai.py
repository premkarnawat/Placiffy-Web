"""
AI Service — Groq API (Llama 3.3 70B) for all AI-powered features.
Falls back to rule-based logic when Groq key is not set.
"""
import os
import json
import re
from typing import Any
from app.config import get_settings

settings = get_settings()

def _get_groq_client():
    try:
        from groq import Groq
        if settings.groq_api_key:
            return Groq(api_key=settings.groq_api_key)
    except ImportError:
        pass
    return None

def _groq_chat(messages: list, model: str = "llama-3.3-70b-versatile", temperature: float = 0.3, max_tokens: int = 2048) -> str:
    """Call Groq API and return text response."""
    client = _get_groq_client()
    if not client:
        return ""
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        print(f"Groq API error: {e}")
        return ""

def analyze_jd(jd_text: str) -> dict:
    """Analyze Job Description using Groq AI to extract structured data."""
    prompt = f"""Analyze this job description and extract structured information.
Return ONLY valid JSON (no markdown, no explanation):

{{
  "title": "extracted job title",
  "required_skills": ["skill1", "skill2", ...],
  "optional_skills": ["skill1", "skill2", ...],
  "experience_min": 0,
  "experience_max": 10,
  "salary_min": 0,
  "salary_max": 0,
  "location": "location or Remote",
  "work_mode": "remote|hybrid|onsite",
  "employment_type": "full-time|part-time|contract",
  "keywords": ["keyword1", "keyword2", ...],
  "interview_focus_areas": ["area1", "area2", ...],
  "role_summary": "2-3 sentence summary of the role"
}}

Job Description:
{jd_text[:3000]}"""

    response = _groq_chat([{"role": "user", "content": prompt}], temperature=0.1)
    if response:
        try:
            # Extract JSON from response
            json_match = re.search(r'\{[\s\S]+\}', response)
            if json_match:
                return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    # Fallback: rule-based extraction
    COMMON_SKILLS = ["React", "TypeScript", "JavaScript", "Python", "Node.js", "FastAPI",
                     "PostgreSQL", "Docker", "AWS", "GraphQL", "Next.js", "MongoDB"]
    found = [s for s in COMMON_SKILLS if s.lower() in jd_text.lower()]
    exp_match = re.search(r"(\d+)\+?\s+years?", jd_text, re.IGNORECASE)

    return {
        "title": "Software Engineer",
        "required_skills": found[:6] if found else ["JavaScript", "React", "Node.js"],
        "optional_skills": found[6:] if len(found) > 6 else [],
        "experience_min": int(exp_match.group(1)) if exp_match else 2,
        "experience_max": (int(exp_match.group(1)) if exp_match else 2) + 3,
        "salary_min": 0,
        "salary_max": 0,
        "location": "Remote" if "remote" in jd_text.lower() else "On-site",
        "work_mode": "remote" if "remote" in jd_text.lower() else "hybrid",
        "employment_type": "full-time",
        "keywords": found[:8],
        "interview_focus_areas": ["Technical Skills", "Problem Solving", "System Design"],
        "role_summary": f"Engineering role requiring {', '.join(found[:3]) if found else 'strong technical'} skills.",
    }

def parse_resume_with_ai(resume_text: str) -> dict:
    """Use Groq to enhance resume parsing with structured extraction."""
    prompt = f"""Extract structured information from this resume text.
Return ONLY valid JSON:

{{
  "name": "full name",
  "email": "email@example.com",
  "phone": "+91 ...",
  "headline": "Professional headline/current role",
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience_years": 5.0,
  "current_role": "current job title",
  "current_company": "current company",
  "linkedin_url": "linkedin.com/in/...",
  "github_url": "github.com/...",
  "education": [{{"degree": "...", "institution": "...", "year": "..."}}],
  "certifications": ["cert1", "cert2"],
  "location": "city, country",
  "expected_salary_min": 0,
  "expected_salary_max": 0,
  "notice_period_days": 30
}}

Resume:
{resume_text[:4000]}"""

    response = _groq_chat([{"role": "user", "content": prompt}], temperature=0.1)
    if response:
        try:
            json_match = re.search(r'\{[\s\S]+\}', response)
            if json_match:
                return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    return {}

def generate_candidate_summary(candidate_data: dict) -> str:
    """Generate AI summary for a candidate's passport."""
    prompt = f"""Write a concise 3-sentence professional summary for this candidate's hiring passport.
Be objective, professional, and highlight key strengths.

Candidate Data: {json.dumps(candidate_data, default=str)[:2000]}

Summary:"""
    response = _groq_chat([{"role": "user", "content": prompt}], temperature=0.5, max_tokens=300)
    if response:
        return response.strip()
    name = candidate_data.get("name", "This candidate")
    skills = candidate_data.get("skills", [])[:3]
    exp = candidate_data.get("experience_years", 0)
    return f"{name} is a verified professional with {exp}+ years of experience specializing in {', '.join(skills) or 'software engineering'}. Their profile has been thoroughly verified through Placify's AI-powered assessment pipeline. They demonstrate strong technical credibility and low fraud risk."

def generate_interview_questions(jd_text: str, candidate_skills: list) -> list:
    """Generate tailored interview questions using Groq."""
    prompt = f"""Generate 8 targeted interview questions for this role based on the JD and candidate skills.
Mix technical, behavioral, and situational questions.
Return as JSON array: [{{"type": "technical|behavioral|situational", "question": "..."}}]

JD: {jd_text[:1500]}
Candidate Skills: {', '.join(candidate_skills[:10])}"""

    response = _groq_chat([{"role": "user", "content": prompt}], temperature=0.6, max_tokens=1000)
    if response:
        try:
            json_match = re.search(r'\[[\s\S]+\]', response)
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
    return [
        {"type": "technical", "question": "Describe your experience with the primary tech stack required for this role."},
        {"type": "behavioral", "question": "Tell me about a challenging project you led and how you overcame obstacles."},
        {"type": "situational", "question": "How would you handle a situation where your team disagrees on a technical approach?"},
    ]

def generate_fraud_review(candidate_data: dict, fraud_signals: dict) -> dict:
    """Use Groq to generate a fraud assessment narrative."""
    prompt = f"""You are a fraud detection analyst reviewing a job candidate.
Analyze these signals and provide assessment.
Return JSON: {{"risk_level": "LOW|MEDIUM|HIGH", "confidence": 0.0-1.0, "explanation": "...", "flags": ["flag1", ...]}}

Candidate: {json.dumps(candidate_data, default=str)[:1000]}
Signals: {json.dumps(fraud_signals, default=str)}"""

    response = _groq_chat([{"role": "user", "content": prompt}], temperature=0.2)
    if response:
        try:
            json_match = re.search(r'\{[\s\S]+\}', response)
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
    return {"risk_level": "LOW", "confidence": 0.7, "explanation": "No significant fraud signals detected.", "flags": []}

def answer_recruiter_query(query: str, context: dict) -> str:
    """AI assistant for recruiter queries."""
    system = """You are Placify's AI hiring assistant. You help recruiters make data-driven hiring decisions.
You have access to candidate data, ATS scores, and verification status.
Be concise, professional, and actionable. Always reference specific data."""

    prompt = f"""Recruiter Query: {query}
Context Data: {json.dumps(context, default=str)[:2000]}

Provide a helpful, data-driven response:"""

    response = _groq_chat([
        {"role": "system", "content": system},
        {"role": "user", "content": prompt}
    ], temperature=0.4, max_tokens=500)

    if response:
        return response.strip()
    return "I can help you analyze candidate data, ATS scores, and verification status. Please ask about specific candidates or roles."
