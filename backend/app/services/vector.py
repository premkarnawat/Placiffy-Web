from typing import List

class VectorSearchService:
    @staticmethod
    def generate_embedding(text: str) -> List[float]:
        return [0.0] * 1024

    @staticmethod
    def compute_ats_score(resume_skills: List[str], jd_skills: List[str]) -> int:
        if not jd_skills:
            return 80
        match_count = len(set(resume_skills) & set(jd_skills))
        total_required = len(jd_skills)
        score = int((match_count / total_required) * 100)
        return max(50, min(100, score))
