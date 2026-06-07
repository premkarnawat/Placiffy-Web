"""
Vector Embedding Service for semantic candidate-job matching.
Uses sentence-transformers BAAI/bge-large-en-v1.5 (1024 dims).
Falls back to TF-IDF cosine similarity when model unavailable.
"""
import os
import math
import re
from typing import Optional

# Try loading sentence-transformers
_model = None
_model_loaded = False

def _load_model():
    global _model, _model_loaded
    if _model_loaded:
        return _model
    try:
        from sentence_transformers import SentenceTransformer
        model_name = os.getenv("EMBEDDING_MODEL", "BAAI/bge-large-en-v1.5")
        _model = SentenceTransformer(model_name)
        _model_loaded = True
        print(f"Loaded embedding model: {model_name}")
    except Exception as e:
        print(f"Could not load embedding model: {e}. Using fallback.")
        _model = None
        _model_loaded = True
    return _model

def generate_embedding(text: str) -> list[float]:
    """Generate 1024-dim embedding for text. Falls back to TF-IDF vector."""
    model = _load_model()
    if model:
        try:
            embedding = model.encode(text, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            print(f"Embedding generation error: {e}")

    # Fallback: simple bag-of-words vector (1024 dims via hashing)
    return _hash_embedding(text, dims=1024)

def _hash_embedding(text: str, dims: int = 1024) -> list[float]:
    """Deterministic text embedding via character n-gram hashing."""
    vector = [0.0] * dims
    words = re.sub(r"[^a-zA-Z0-9\s]", "", text.lower()).split()
    for word in words:
        idx = hash(word) % dims
        vector[idx] += 1.0
    # L2 normalize
    norm = math.sqrt(sum(v * v for v in vector)) or 1.0
    return [v / norm for v in vector]

def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def compute_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """
    Compute semantic similarity between resume and job description.
    Returns 0.0-1.0 similarity score.
    """
    resume_emb = generate_embedding(resume_text)
    jd_emb = generate_embedding(jd_text)
    similarity = cosine_similarity(resume_emb, jd_emb)
    return round(max(0.0, min(1.0, similarity)), 4)

async def find_matching_candidates_db(
    job_embedding: list[float],
    db,
    limit: int = 20,
    min_similarity: float = 0.5
) -> list[dict]:
    """
    Find top matching candidates using pgvector cosine similarity.
    Requires asyncpg/SQLAlchemy connection.
    """
    try:
        embedding_str = "[" + ",".join(str(v) for v in job_embedding) + "]"
        query = f"""
            SELECT
                c.id, c.user_id, u.full_name, c.skills, c.experience_years,
                c.location, c.expected_salary_min, c.expected_salary_max,
                c.trust_score, c.ats_score, c.verification_status,
                1 - (c.resume_embedding <=> \'{embedding_str}\'::vector) AS similarity
            FROM candidates c
            JOIN users u ON c.user_id = u.id
            WHERE c.resume_embedding IS NOT NULL
                AND c.open_to_work = TRUE
                AND u.is_active = TRUE
            ORDER BY c.resume_embedding <=> \'{embedding_str}\'::vector
            LIMIT {limit}
        """
        result = await db.execute(query)
        rows = result.fetchall()
        return [
            {
                "candidate_id": str(row[0]),
                "user_id": str(row[1]),
                "name": row[2],
                "skills": row[3] or [],
                "experience_years": row[4],
                "location": row[5],
                "expected_salary_min": row[6],
                "expected_salary_max": row[7],
                "trust_score": row[8],
                "ats_score": row[9],
                "verification_status": row[10],
                "similarity_score": float(row[11]),
            }
            for row in rows
            if float(row[11] or 0) >= min_similarity
        ]
    except Exception as e:
        print(f"pgvector search error: {e}")
        return []
