"""
Trust Score Engine
Weights: ATS=15%, Portfolio=20%, WorkSample=25%, Expert=20%, Communication=10%, Reliability=10%
"""

WEIGHTS = {
    "ats": 0.15,
    "portfolio": 0.20,
    "work_sample": 0.25,
    "expert": 0.20,
    "communication": 0.10,
    "reliability": 0.10,
}

RECOMMENDATION_THRESHOLDS = [
    (90, "Elite", "Exceptional candidate — strongly recommend for immediate hire."),
    (80, "Strong", "Well-verified candidate — recommend proceeding to offer stage."),
    (70, "Average", "Competent candidate — proceed with standard interview process."),
    (60, "Below Average", "Some concerns — additional screening recommended."),
    (0,  "Insufficient", "Verification incomplete or significant red flags detected."),
]

def compute_trust_score(
    ats_score: int = 0,
    portfolio_score: int = 0,
    work_sample_score: int = 0,
    expert_score: int = 0,
    communication_score: int = 0,
    reliability_score: int = 100,
) -> dict:
    """
    Compute weighted trust score from all verification components.
    All inputs should be 0-100.
    Returns trust_score, breakdown, recommendation.
    """
    # Normalize inputs
    def clamp(v): return max(0, min(100, int(v or 0)))

    ats = clamp(ats_score)
    portfolio = clamp(portfolio_score)
    work_sample = clamp(work_sample_score)
    expert = clamp(expert_score)
    communication = clamp(communication_score)
    reliability = clamp(reliability_score)

    trust_score = int(
        ats * WEIGHTS["ats"] +
        portfolio * WEIGHTS["portfolio"] +
        work_sample * WEIGHTS["work_sample"] +
        expert * WEIGHTS["expert"] +
        communication * WEIGHTS["communication"] +
        reliability * WEIGHTS["reliability"]
    )

    # Recommendation
    level = "Insufficient"
    recommendation = "Verification incomplete."
    for threshold, lbl, rec in RECOMMENDATION_THRESHOLDS:
        if trust_score >= threshold:
            level = lbl
            recommendation = rec
            break

    # Joining probability (heuristic based on trust + reliability)
    joining_probability = min(99, int((trust_score * 0.6 + reliability * 0.4) * 0.99))

    return {
        "trust_score": trust_score,
        "recommendation_level": level,
        "recommendation": recommendation,
        "joining_probability": joining_probability,
        "breakdown": {
            "ats": {"score": ats, "weight": WEIGHTS["ats"], "contribution": round(ats * WEIGHTS["ats"], 1)},
            "portfolio": {"score": portfolio, "weight": WEIGHTS["portfolio"], "contribution": round(portfolio * WEIGHTS["portfolio"], 1)},
            "work_sample": {"score": work_sample, "weight": WEIGHTS["work_sample"], "contribution": round(work_sample * WEIGHTS["work_sample"], 1)},
            "expert": {"score": expert, "weight": WEIGHTS["expert"], "contribution": round(expert * WEIGHTS["expert"], 1)},
            "communication": {"score": communication, "weight": WEIGHTS["communication"], "contribution": round(communication * WEIGHTS["communication"], 1)},
            "reliability": {"score": reliability, "weight": WEIGHTS["reliability"], "contribution": round(reliability * WEIGHTS["reliability"], 1)},
        },
    }

def compute_reliability_score(events: list) -> int:
    """
    Compute reliability score from behavioral events.
    events: list of {type: str, outcome: str} dicts
    Types: interview_attendance, response_time, offer_acceptance, joining_success
    """
    if not events:
        return 100

    score = 100
    deductions = {
        "interview_no_show": -20,
        "interview_late": -5,
        "slow_response": -5,
        "offer_rejected": -10,
        "offer_ghosted": -15,
        "joining_no_show": -25,
    }
    additions = {
        "interview_attended": 2,
        "fast_response": 2,
        "offer_accepted": 5,
        "joined_successfully": 10,
    }

    for event in events:
        event_type = event.get("type", "")
        outcome = event.get("outcome", "")
        key = f"{event_type}_{outcome}" if outcome else event_type
        score += deductions.get(key, 0) + additions.get(key, 0)

    return max(0, min(100, score))
