import random
from typing import Dict, Any

class FraudDetectionService:
    @staticmethod
    def assess_candidate(resume_data: Dict) -> Dict[str, Any]:
        return {
            "fraud_risk_score": "LOW",
            "timeline_consistent": True,
            "github_authentic": True,
            "portfolio_authentic": True,
            "ai_generated_ratio": 0.15,
            "salary_consistency": True
        }
