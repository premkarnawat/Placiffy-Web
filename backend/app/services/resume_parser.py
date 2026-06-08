
import os
import io
import json
import re
from groq import Groq

def parse_pdf(content: bytes) -> str:
    """Parse PDF using PyMuPDF (fast) or pdfplumber (fallback)."""
    text = ""
    try:
        import fitz
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            text += page.get_text("text") + "\n"
        doc.close()
        if text.strip(): return text
    except ImportError: pass
    except Exception: pass

    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
        return text
    except ImportError: pass
    except Exception as e: print(f"pdfplumber error: {e}")
    return ""

def parse_docx(content: bytes) -> str:
    """Parse DOCX using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    except ImportError: pass
    except Exception as e: print(f"DOCX parse error: {e}")
    return ""

def parse_resume_ai(raw_text: str) -> dict:
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    if not groq_api_key:
        return {"error": "GROQ_API_KEY missing"}
        
    client = Groq(api_key=groq_api_key)
    
    prompt = f"""
    You are an expert HR ATS parser. Extract the following from the resume text into a strict JSON object:
    {{
        "name": "string",
        "email": "string",
        "phone": "string",
        "skills": ["string"],
        "experience": [
            {{"company": "string", "title": "string", "duration": "string", "description": "string"}}
        ],
        "education": [
            {{"institution": "string", "degree": "string", "year": "string"}}
        ],
        "projects": [
            {{"name": "string", "description": "string"}}
        ],
        "certifications": ["string"],
        "linkedin_url": "string",
        "github_url": "string",
        "portfolio_url": "string"
    }}
    
    If any field is completely missing, return an empty string or empty array for it. Do not invent information.
    
    Resume Text:
    {raw_text[:8000]}
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        data["raw_text"] = raw_text[:8000]
        data["word_count"] = len(raw_text.split())
        return data
    except Exception as e:
        print(f"AI Parsing Error: {e}")
        return {"error": str(e), "raw_text": raw_text[:8000], "skills": []}

def parse_resume(content: bytes, filename: str = "resume.pdf") -> dict:
    """
    Full resume parsing pipeline using AI.
    Returns structured dict with all extracted fields.
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "pdf"
    if ext == "pdf":
        raw_text = parse_pdf(content)
    elif ext in ("docx", "doc"):
        raw_text = parse_docx(content)
    else:
        raw_text = content.decode("utf-8", errors="ignore")

    if not raw_text.strip():
        return {"error": "Could not extract text from file", "raw_text": "", "skills": []}

    return parse_resume_ai(raw_text)
