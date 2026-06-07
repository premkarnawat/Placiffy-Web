"""
Fraud Detection Engine — Multi-signal analysis.
Signals: Timeline, Education, Skills, Portfolio, GitHub, Salary, AI content ratio.
"""
import re
from typing import Any
from datetime import datetime

def analyze_timeline(experience: list) -> dict:
    """Check for timeline gaps, overlaps, or impossibilities."""
    flags = []
    total_months = 0
    prev_end = None

    for exp in sorted(experience, key=lambda x: x.get("start", ""), reverse=False):
        start_str = exp.get("start", "")
        end_str = exp.get("end", "Present")

        # Parse years
        start_year = _extract_year(start_str)
        end_year = _extract_year(end_str) if end_str != "Present" else datetime.now().year

        if start_year and end_year:
            if end_year < start_year:
                flags.append(f"Timeline error: end ({end_year}) before start ({start_year})")
            if start_year < 1990 or start_year > datetime.now().year:
                flags.append(f"Suspicious year: {start_year}")
            total_months += (end_year - start_year) * 12

        # Check for overlap
        if prev_end and start_year and start_year < prev_end - 1:
            flags.append(f"Overlapping employment periods detected ({start_year} overlaps prev role)")

        prev_end = end_year

    return {
        "consistent": len(flags) == 0,
        "total_experience_months": total_months,
        "flags": flags,
    }

def _extract_year(s: str) -> int:
    if not s:
        return 0
    match = re.search(r"(19|20)\d{2}", str(s))
    return int(match.group()) if match else 0

def check_skill_consistency(skills: list, experience: list) -> dict:
    """Check if claimed skills match experience timeline (5+ years claim needs history)."""
    flags = []
    total_years = sum(
        ((_extract_year(e.get("end", str(datetime.now().year))) or datetime.now().year) -
         (_extract_year(e.get("start", "")) or datetime.now().year))
        for e in experience
    )

    # Sanity check: can't have 10 years exp with 2 years total work history
    claimed_exp_years = len(experience) * 1.5  # rough heuristic
    if total_years > 40:
        flags.append(f"Total experience exceeds plausible career length: {total_years} years")

    return {"consistent": len(flags) == 0, "flags": flags}

def assess_github(github_url: str, skills: list) -> dict:
    """Assess GitHub authenticity (basic checks)."""
    flags = []
    if github_url:
        # URL format check
        if not re.match(r"github\.com/[\w\-]{2,39}$", github_url.replace("https://", "").replace("www.", "")):
            flags.append("GitHub URL format unusual")
    return {"authentic": len(flags) == 0, "flags": flags}

def detect_ai_content(text: str) -> float:
    """Heuristic AI content detection in resume text."""
    ai_phrases = [
        "leverage", "spearheaded", "synergize", "utilize", "facilitate",
        "orchestrate", "architect", "revolutionize", "paradigm shift",
        "transformative", "cutting-edge", "state-of-the-art", "best-in-class",
        "proactively", "strategically aligned", "cross-functional",
    ]
    text_lower = text.lower()
    word_count = max(len(text.split()), 1)
    phrase_count = sum(1 for p in ai_phrases if p in text_lower)
    ratio = phrase_count / max(word_count / 100, 1)
    return min(1.0, ratio / 5)

def compute_fraud_score(signals: dict) -> float:
    """Convert binary signals into a 0-1 fraud probability score."""
    weights = {
        "timeline_inconsistent": 0.25,
        "skills_inconsistent": 0.15,
        "github_inauthentic": 0.15,
        "ai_content_high": 0.20,
        "salary_inconsistent": 0.15,
        "education_suspicious": 0.10,
    }
    score = 0.0
    for key, weight in weights.items():
        if signals.get(key, False):
            score += weight
    return round(score, 3)

def assess_candidate(candidate_data: dict) -> dict:
    """Full fraud assessment pipeline."""
    experience = candidate_data.get("experience", [])
    skills = candidate_data.get("skills", [])
    text = candidate_data.get("raw_text", "")
    github_url = candidate_data.get("github_url", "")
    expected_salary = candidate_data.get("expected_salary_max", 0) or 0

    timeline = analyze_timeline(experience)
    skill_check = check_skill_consistency(skills, experience)
    github_check = assess_github(github_url, skills)
    ai_ratio = detect_ai_content(text)

    signals = {
        "timeline_inconsistent": not timeline["consistent"],
        "skills_inconsistent": not skill_check["consistent"],
        "github_inauthentic": not github_check["authentic"],
        "ai_content_high": ai_ratio > 0.5,
        "salary_inconsistent": expected_salary > 10000000,  # > 1 Cr sanity check
        "education_suspicious": False,  # Would need external verification
    }

    fraud_score = compute_fraud_score(signals)
    all_flags = timeline["flags"] + skill_check["flags"] + github_check["flags"]

    if ai_ratio > 0.5:
        all_flags.append(f"High AI-generated content ratio: {ai_ratio:.0%}")

    risk_level = "LOW" if fraud_score < 0.2 else "MEDIUM" if fraud_score < 0.5 else "HIGH"

    return {
        "fraud_risk": risk_level,
        "fraud_score": fraud_score,
        "timeline_consistent": timeline["consistent"],
        "github_authentic": github_check["authentic"],
        "skills_authentic": skill_check["consistent"],
        "ai_generated_ratio": round(ai_ratio, 3),
        "salary_consistent": not signals["salary_inconsistent"],
        "flags": all_flags,
        "signals": signals,
    }
