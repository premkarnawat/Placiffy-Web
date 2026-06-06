from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import random
from app.models import User, CandidateProfile, Job, Application, Passport, ChatMessage, CommunityPost, CommunityComment, ApiKey
from app.services.ai import AIService
from app.services.vector import VectorSearchService
from app.services.fraud import FraudDetectionService

app = FastAPI(title="Placify API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage simulated databases
JOBS = []
APPLICATIONS = [
    {"id": "a1", "name": "Sarah Jenkins", "role": "React Developer", "ats_score": 94, "trust_score": 95, "expected_salary": "$130k", "notice_period": "Immediate", "fraud_risk": "LOW", "skills": ["React", "TypeScript", "Tailwind CSS"]},
    {"id": "a2", "name": "David Chen", "role": "Frontend Architect", "ats_score": 88, "trust_score": 87, "expected_salary": "$160k", "notice_period": "30 Days", "fraud_risk": "LOW", "skills": ["React", "TypeScript", "AWS"]},
    {"id": "a3", "name": "Elena Rostova", "role": "React Native Dev", "ats_score": 82, "trust_score": 91, "expected_salary": "$120k", "notice_period": "15 Days", "fraud_risk": "LOW", "skills": ["React", "TypeScript"]},
    {"id": "a4", "name": "Marcus Brodie", "role": "UI/UX Developer", "ats_score": 91, "trust_score": 65, "expected_salary": "$140k", "notice_period": "Immediate", "fraud_risk": "MEDIUM", "skills": ["React", "Figma"]}
]
POSTS = [
    CommunityPost(id="p1", title="Tips for passing the React Work Sample challenge", content="Ensure your state changes are batch updated correctly, and that tailwind variables are configured cleanly.", author="Sarah Jenkins", category="Mock Interviews", likes=14, replies=3, timestamp="2 hrs ago"),
    CommunityPost(id="p2", title="How to stand out in Placify Expert Marketplace", content="Always grade according to standard rubrics and write detailed qualitative review summaries.", author="David Chen", category="Expert Sessions", likes=8, replies=1, timestamp="5 hrs ago")
]
COMMENTS = [
    CommunityComment(id="c1", post_id="p1", content="This is super helpful, thanks Sarah!", author="Elena Rostova", timestamp="1 hr ago")
]
API_KEYS = [
    ApiKey(id="k1", name="Stripe Integration Key", key="plc_live_8792hjs82js01", created_at="06-06-2026", status="active")
]

@app.get("/")
def read_root():
    return {"message": "Welcome to Placify Hiring Intelligence API"}

@app.post("/api/jobs", response_model=Job)
def create_job(role: str, jd_text: str):
    analysis = AIService.analyze_jd(jd_text)
    job = Job(
        id=f"job_{len(JOBS)+1}",
        company_id="comp_1",
        role=role,
        jd_text=jd_text,
        required_skills=analysis["required_skills"],
        optional_skills=analysis["optional_skills"],
        experience_required=analysis["experience_required"],
        location="Remote",
        work_mode="remote"
    )
    JOBS.append(job)
    return job

@app.post("/api/screen-resume")
def screen_resume(resume_text: str, jd_id: str):
    job = next((j for j in JOBS if j.id == jd_id), None)
    job_skills = job.required_skills if job else ["React", "TypeScript", "Tailwind CSS"]
        
    parsed = AIService.parse_resume(resume_text)
    ats_score = VectorSearchService.compute_ats_score(parsed["skills"], job_skills)
    fraud = FraudDetectionService.assess_candidate(parsed)
    
    passport = Passport(
        candidate_id=f"PLC-{random_id()}",
        name=parsed["name"],
        role=parsed["role"],
        trust_score=int(ats_score * 0.15 + 80 * 0.85),
        ats_score=ats_score,
        portfolio_score=85,
        work_sample_score=90,
        expert_score=85,
        reliability_score=100,
        communication_score=90,
        fraud_risk=fraud["fraud_risk_score"],
        joining_probability=95,
        recommendation="Good fit based on matching profiles.",
        qr_code_link=f"https://placify.ai/qr/PLC-dummy",
        pdf_download_link=f"https://placify.ai/download/PLC-dummy"
    )
    return {
        "candidate": parsed,
        "ats_score": ats_score,
        "fraud_assessment": fraud,
        "passport": passport
    }

# NEW ENDPOINTS FOR PHASES 2 TO 5
@app.post("/api/assistant/chat")
def chatbot_assistant(query: str):
    response = AIService.answer_recruiter_query(query, APPLICATIONS)
    return {"reply": response}

@app.get("/api/community/posts", response_model=List[CommunityPost])
def get_posts():
    return POSTS

@app.post("/api/community/posts", response_model=CommunityPost)
def create_post(title: str, content: str, author: str, category: str):
    post = CommunityPost(
        id=f"p{len(POSTS)+1}",
        title=title,
        content=content,
        author=author,
        category=category,
        timestamp="Just now"
    )
    POSTS.append(post)
    return post

@app.get("/api/community/comments", response_model=List[CommunityComment])
def get_comments(post_id: str):
    return [c for c in COMMENTS if c.post_id == post_id]

@app.post("/api/community/comments", response_model=CommunityComment)
def create_comment(post_id: str, content: str, author: str):
    comment = CommunityComment(
        id=f"c{len(COMMENTS)+1}",
        post_id=post_id,
        content=content,
        author=author,
        timestamp="Just now"
    )
    COMMENTS.append(comment)
    return comment

@app.get("/api/enterprise/keys", response_model=List[ApiKey])
def get_keys():
    return API_KEYS

@app.post("/api/enterprise/keys", response_model=ApiKey)
def generate_key(name: str):
    key = ApiKey(
        id=f"k{len(API_KEYS)+1}",
        name=name,
        key=f"plc_live_{random_id()}hjs{random_id()}js01",
        created_at="06-06-2026",
        status="active"
    )
    API_KEYS.append(key)
    return key

@app.get("/api/analytics")
def get_analytics():
    return {
        "pipeline_stages": [
            {"name": "Applied", "count": 48},
            {"name": "Matched", "count": 32},
            {"name": "Interested", "count": 21},
            {"name": "Verification", "count": 16},
            {"name": "Verified", "count": 12}
        ],
        "score_distribution": [
            {"score": "50-60", "candidates": 2},
            {"score": "60-70", "candidates": 5},
            {"score": "70-80", "candidates": 14},
            {"score": "80-90", "candidates": 19},
            {"score": "90-100", "candidates": 8}
        ],
        "reliability_speed_mins": [
            {"month": "Jan", "mins": 25},
            {"month": "Feb", "mins": 19},
            {"month": "Mar", "mins": 15},
            {"month": "Apr", "mins": 12},
            {"month": "May", "mins": 10}
        ],
        "fraud_risk_shares": [
            {"name": "Low Risk", "value": 94},
            {"name": "Medium Risk", "value": 5},
            {"name": "High Risk", "value": 1}
        ]
    }

def random_id():
    return str(random.randint(1000, 9999))
