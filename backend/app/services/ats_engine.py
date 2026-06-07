"""
ATS Engine — 6-dimension scoring for candidate-job matching.
Dimensions: Skills(35%) + Experience(20%) + Education(15%) + Location(10%) + Salary(10%) + Semantic(10%)
"""
from typing import Any
import re

# Experience level mapping
EDUCATION_LEVELS = {
    "phd": 5, "doctorate": 5,
    "master": 4, "m.tech": 4, "mca": 4, "mba": 4, "msc": 4, "m.e.": 4,
    "bachelor": 3, "b.tech": 3, "bca": 3, "b.e.": 3, "bsc": 3, "be": 3,
    "diploma": 2,
    "12th": 1, "high school": 1,
}

def score_skills(candidate_skills: list, required_skills: list, optional_skills: list = None) -> dict:
    """Score based on skill overlap. Required skills weighted 3x optional."""
    if not required_skills:
        return {"score": 80, "matched": [], "missing": [], "optional_matched": []}

    cand_lower = set(s.lower() for s in candidate_skills)
    req_lower = {s.lower(): s for s in required_skills}
    opt_lower = {s.lower(): s for s in (optional_skills or [])}

    matched_req = [req_lower[s] for s in cand_lower if s in req_lower]
    missing_req = [req_lower[s] for s in req_lower if s not in cand_lower]
    matched_opt = [opt_lower[s] for s in cand_lower if s in opt_lower]

    # Weighted: required=70%, optional=30%
    req_score = (len(matched_req) / max(len(required_skills), 1)) * 70
    opt_score = (len(matched_opt) / max(len(optional_skills or []), 1)) * 30 if optional_skills else 30

    return {
        "score": min(100, int(req_score + opt_score)),
        "matched": matched_req,
        "missing": missing_req,
        "optional_matched": matched_opt,
    }

def score_experience(candidate_years: float, required_min: float, required_max: float) -> int:
    """Score experience match."""
    if candidate_years >= required_min:
        if candidate_years <= required_max + 2:
            return 100  # Perfect range
        else:
            return 85   # Overqualified but still good
    ratio = candidate_years / max(required_min, 1)
    return max(0, int(ratio * 100))

def score_education(candidate_education: list, jd_text: str = "") -> int:
    """Score education match against JD requirements."""
    if not candidate_education:
        return 60  # No data = neutral

    # Check JD for education requirements
    jd_lower = (jd_text or "").lower()
    max_level = 0
    for item in candidate_education:
        deg = item.get("degree", "").lower()
        for key, level in EDUCATION_LEVELS.items():
            if key in deg:
                max_level = max(max_level, level)

    # If JD requires specific degree
    if "phd" in jd_lower or "doctorate" in jd_lower:
        return 100 if max_level >= 5 else max(40, max_level * 20)
    if "master" in jd_lower or "m.tech" in jd_lower:
        return 100 if max_level >= 4 else max(60, max_level * 20)
    if "bachelor" in jd_lower or "b.tech" in jd_lower or "degree" in jd_lower:
        return 100 if max_level >= 3 else max(50, max_level * 25)

    # Default: any degree is fine
    return 100 if max_level >= 3 else 80

def score_location(candidate_location: str, job_location: str, work_mode: str = "hybrid") -> int:
    """Score location compatibility."""
    if work_mode == "remote":
        return 100  # Remote = always compatible

    if not candidate_location or not job_location:
        return 75  # No data = neutral

    cand_lower = candidate_location.lower()
    job_lower = job_location.lower()

    # Same city
    cities = ["bangalore", "bengaluru", "mumbai", "delhi", "hyderabad", "pune",
              "chennai", "kolkata", "ahmedabad", "remote"]
    for city in cities:
        if city in cand_lower and city in job_lower:
            return 100

    # Same country (simplified)
    if "india" in cand_lower or "india" in job_lower:
        if work_mode == "hybrid":
            return 70
        return 50

    return 60

def score_salary(candidate_min: int, candidate_max: int, job_min: int, job_max: int) -> int:
    """Score salary alignment."""
    # No data = neutral
    if not any([candidate_min, candidate_max, job_min, job_max]):
        return 80

    # Overlap check
    c_min = candidate_min or 0
    c_max = candidate_max or (c_min * 2 if c_min else 9999999)
    j_min = job_min or 0
    j_max = job_max or (j_min * 2 if j_min else 9999999)

    if c_min <= j_max and c_max >= j_min:
        # There is overlap
        overlap = min(c_max, j_max) - max(c_min, j_min)
        total = max(c_max, j_max) - min(c_min, j_min)
        return int((overlap / max(total, 1)) * 100)

    # Candidate expects too high
    if c_min > j_max:
        gap_pct = (c_min - j_max) / max(j_max, 1)
        return max(0, int(100 - gap_pct * 100))

    return 70

def compute_ats_score(
    candidate: dict,
    job: dict,
    semantic_similarity: float = 0.0
) -> dict:
    """
    Compute full 6-dimension ATS score.

    Weights:
    - Skills: 35%
    - Experience: 20%
    - Education: 15%
    - Location: 10%
    - Salary: 10%
    - Semantic Similarity: 10%
    """
    skills_result = score_skills(
        candidate.get("skills", []),
        job.get("required_skills", []),
        job.get("optional_skills", []),
    )
    exp_score = score_experience(
        candidate.get("experience_years", 0),
        job.get("experience_min", 0),
        job.get("experience_max", 10),
    )
    edu_score = score_education(
        candidate.get("education", []),
        job.get("description", ""),
    )
    loc_score = score_location(
        candidate.get("location", ""),
        job.get("location", ""),
        job.get("work_mode", "hybrid"),
    )
    sal_score = score_salary(
        candidate.get("expected_salary_min", 0),
        candidate.get("expected_salary_max", 0),
        job.get("salary_min", 0),
        job.get("salary_max", 0),
    )
    semantic_score = int(semantic_similarity * 100)

    final_score = int(
        skills_result["score"] * 0.35 +
        exp_score * 0.20 +
        edu_score * 0.15 +
        loc_score * 0.10 +
        sal_score * 0.10 +
        semantic_score * 0.10
    )

    return {
        "ats_score": final_score,
        "skills_score": skills_result["score"],
        "experience_score": exp_score,
        "education_score": edu_score,
        "location_score": loc_score,
        "salary_score": sal_score,
        "semantic_score": semantic_score,
        "skills_matched": skills_result["matched"],
        "skills_missing": skills_result["missing"],
        "optional_matched": skills_result["optional_matched"],
    }
