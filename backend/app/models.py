from typing import Optional, List
from pydantic import BaseModel

class User(BaseModel):
    id: str
    email: str
    role: str
    name: str

class CandidateProfile(BaseModel):
    id: str
    user_id: str
    resume_url: Optional[str] = None
    skills: List[str] = []
    experience_years: float
    current_salary: Optional[str] = None
    expected_salary: Optional[str] = None
    notice_period: Optional[str] = None
    reliability_score: int = 100
    trust_score: int = 0
    fraud_risk: str = "LOW"

class Job(BaseModel):
    id: str
    company_id: str
    role: str
    jd_text: str
    required_skills: List[str]
    optional_skills: List[str] = []
    experience_required: float
    location: str
    work_mode: str
    hiring_mode: str = "self"

class Application(BaseModel):
    id: str
    job_id: str
    candidate_id: str
    stage: str
    ats_score: int
    interest_confirmed: bool = False

class Verification(BaseModel):
    id: str
    application_id: str
    stage_1_portfolio: bool = False
    stage_2_work_sample: bool = False
    stage_3_ai_evaluation: bool = False
    stage_4_expert_review: bool = False
    stage_5_reliability: bool = False
    status: str = "PENDING"

class WorkSample(BaseModel):
    id: str
    application_id: str
    challenge_description: str
    code_submission_url: Optional[str] = None
    grade_ai: Optional[int] = None
    grade_expert: Optional[int] = None
    feedback: Optional[str] = None

class ExpertScorecard(BaseModel):
    id: str
    expert_id: str
    work_sample_id: str
    technical_knowledge: int = 30
    project_understanding: int = 25
    problem_solving: int = 20
    communication: int = 15
    professionalism: int = 10
    total_score: int = 0
    rubric_completed: bool = False

class Passport(BaseModel):
    candidate_id: str
    name: str
    role: str
    trust_score: int
    ats_score: int
    portfolio_score: int
    work_sample_score: int
    expert_score: int
    reliability_score: int
    communication_score: int
    fraud_risk: str
    joining_probability: int
    recommendation: str
    qr_code_link: str
    pdf_download_link: str

# NEW MODELS FOR PHASES 2 TO 5
class ChatMessage(BaseModel):
    role: str # user, assistant
    content: str
    timestamp: str

class CommunityPost(BaseModel):
    id: str
    title: str
    content: str
    author: str
    category: str
    likes: int = 0
    replies: int = 0
    timestamp: str

class CommunityComment(BaseModel):
    id: str
    post_id: str
    content: str
    author: str
    timestamp: str

class ApiKey(BaseModel):
    id: str
    name: str
    key: str
    created_at: str
    status: str # active, revoked
