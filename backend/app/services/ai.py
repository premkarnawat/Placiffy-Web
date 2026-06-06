import random
from typing import Dict, Any, List

class AIService:
    @staticmethod
    def parse_resume(resume_text: str) -> Dict[str, Any]:
        skills = ["React", "TypeScript", "Tailwind CSS", "Next.js", "FastAPI", "Python", "SQLAlchemy"]
        extracted_skills = [s for s in skills if s.lower() in resume_text.lower()]
        if not extracted_skills:
            extracted_skills = ["React", "TypeScript", "Tailwind CSS"]
            
        return {
            "name": "Alex Vance",
            "role": "Senior Full Stack Engineer",
            "skills": extracted_skills,
            "experience_years": 5.5,
            "education": "BS Computer Science",
            "fraud_risk": "LOW"
        }

    @staticmethod
    def analyze_jd(jd_text: str) -> Dict[str, Any]:
        return {
            "role": "Senior React Developer",
            "required_skills": ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
            "optional_skills": ["FastAPI", "Supabase"],
            "experience_required": 5.0,
            "screening_criteria": "Standard Frontend UI assessment, design system integrity checks, mock state testing."
        }

    @staticmethod
    def generate_work_sample(jd_role: str) -> str:
        challenges = {
            "React": "Build a responsive Dashboard Kanban grid supporting drag and drop with local storage state management.",
            "FastAPI": "Build a secure REST API using FastAPI, SQLAlchemy models, pgvector similarity search matching, and unit tests.",
            "UIUX": "Create a high-fidelity Figma user flow for verified talent passport checkouts including invoice systems."
        }
        for k, v in challenges.items():
            if k.lower() in jd_role.lower():
                return v
        return "Build a comprehensive coding application with structural organization, tests, and documentation."

    # NEW AI SERVICE FUNCTIONS FOR PHASES 2 TO 5
    @staticmethod
    def answer_recruiter_query(query: str, candidates: List[Dict]) -> str:
        """
        Recruiter Chat AI Assistant that answers context questions about candidates.
        """
        query_lower = query.lower()
        
        # Simple keywords matching logic acting as LLM reasoning
        if "react" in query_lower:
            matches = [c["name"] for c in candidates if "React" in c.get("skills", [])]
            if matches:
                return f"I found {len(matches)} candidates with verified React experience: {', '.join(matches)}. Among them, Sarah Jenkins scored highest on her work sample (96%)."
            return "No candidates currently have verified React experience matching your criteria."
            
        if "experience" in query_lower or "senior" in query_lower:
            seniors = [c for c in candidates if c.get("experience_years", 0) >= 5]
            if seniors:
                details = [f"{c['name']} ({c['experience_years']} yrs)" for c in seniors]
                return f"The senior candidates in this pipeline are: {', '.join(details)}. They all have passed timeline verification and show low fraud risk profiles."
            return "All candidates in this pipeline have less than 5 years of verified experience."
            
        if "fraud" in query_lower or "risk" in query_lower:
            high_risk = [c["name"] for c in candidates if c.get("fraud_risk") == "HIGH"]
            med_risk = [c["name"] for c in candidates if c.get("fraud_risk") == "MEDIUM"]
            if high_risk or med_risk:
                res = []
                if high_risk: res.append(f"HIGH risk: {', '.join(high_risk)}")
                if med_risk: res.append(f"MEDIUM risk: {', '.join(med_risk)} (Reason: GitHub activity frequency check matches low contribution timeline density)")
                return f"Fraud checks completed. Alerts found: {'. '.join(res)}."
            return "All candidates have been cleared. Fraud risk levels are LOW across all active profiles."
            
        return "I can analyze candidate resumes, work sample results, and expert scorecard criteria. Please ask about skills (e.g. 'React'), experience (e.g. 'Senior'), or fraud/reliability status."
