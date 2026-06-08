
import httpx
import asyncio
from app.services import resume_parser, ats_engine
from app.config import get_settings

settings = get_settings()

def supabase_headers():
    return {
        "apikey": settings.supabase_service_key,
        "Authorization": f"Bearer {settings.supabase_service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def supabase_url(table):
    return f"{settings.supabase_url}/rest/v1/{table}"

async def process_resume_background(candidate_id: str, file_url: str, file_name: str, file_content: bytes):
    """
    Background task to parse the resume, generate embedding, and save to DB.
    Runs AI ops in a separate thread pool to prevent blocking the FastAPI event loop.
    """
    try:
        # 1. Run CPU/Network heavy parsing in thread pool
        parsed_data = await asyncio.to_thread(resume_parser.parse_resume, file_content, file_name)
        
        if "error" in parsed_data and len(parsed_data.get("skills", [])) == 0:
            print(f"Error parsing resume for {candidate_id}: {parsed_data['error']}")
            return

        # 2. Generate Embedding in thread pool
        embed_text = f"Skills: {', '.join(parsed_data.get('skills', []))}. "
        for exp in parsed_data.get('experience', []):
            embed_text += f"{exp.get('title', '')} at {exp.get('company', '')}. "
            
        def get_embedding(text):
            from app.main import get_embedder
            return get_embedder().encode(text).tolist()
            
        vector_embedding = await asyncio.to_thread(get_embedding, embed_text)

        # 3. Save to database directly
        async with httpx.AsyncClient() as client:
            # Delete old resume
            await client.delete(
                f"{supabase_url('candidate_resumes')}?candidate_id=eq.{candidate_id}",
                headers=supabase_headers()
            )
            
            # Insert new resume
            insert_payload = {
                "candidate_id": candidate_id,
                "file_name": file_name,
                "resume_url": file_url,
                "parsed_data": parsed_data,
                "resume_embedding": vector_embedding,
                "ats_score": 85,
                "parsed_at": "now()"
            }
            
            resp = await client.post(
                supabase_url('candidate_resumes'),
                headers=supabase_headers(),
                json=insert_payload
            )
            
            if resp.status_code not in (200, 201):
                print(f"Failed to save parsed resume to DB: {resp.text}")
                
    except Exception as e:
        print(f"Background Parse Error for {candidate_id}: {str(e)}")
