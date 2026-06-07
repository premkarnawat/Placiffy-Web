"""
Resume Parser — PDF (PyMuPDF/pdfplumber) + DOCX (python-docx) + NER (spaCy fallback to regex).
Extracts: name, email, phone, skills, experience, education, links.
"""
import re
import io
from typing import Any

# ── Skill dictionaries (extensible) ─────────────────────────────────────────
TECH_SKILLS = {
    "languages": ["Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB"],
    "frontend": ["React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Framer Motion", "Redux", "GraphQL", "Webpack", "Vite"],
    "backend": ["Node.js", "FastAPI", "Django", "Flask", "Express.js", "Spring Boot", "Laravel", "Rails", "NestJS", "Gin", "Fiber"],
    "databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "DynamoDB", "Supabase", "Firebase", "SQLite", "Elasticsearch"],
    "cloud": ["AWS", "GCP", "Azure", "Vercel", "Heroku", "DigitalOcean", "Cloudflare"],
    "devops": ["Docker", "Kubernetes", "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Ansible", "Nginx", "Linux"],
    "data_ai": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Spark", "Kafka", "Airflow", "LLM", "RAG", "pgvector"],
    "tools": ["Git", "Jira", "Figma", "Postman", "VS Code", "IntelliJ", "Webpack", "Babel"],
    "mobile": ["React Native", "Flutter", "iOS", "Android", "Expo"],
}
ALL_SKILLS = [skill for group in TECH_SKILLS.values() for skill in group]

# ── Extraction helpers ───────────────────────────────────────────────────────
def extract_email(text: str) -> str:
    match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
    return match.group() if match else ""

def extract_phone(text: str) -> str:
    patterns = [
        r"\+?91[-\s]?[6-9]\d{9}",
        r"\+?1[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}",
        r"\b[6-9]\d{9}\b",
        r"\+\d{1,3}[-\s]\d{6,12}",
    ]
    for p in patterns:
        match = re.search(p, text)
        if match:
            return match.group()
    return ""

def extract_linkedin(text: str) -> str:
    match = re.search(r"linkedin\.com/in/[\w\-]+", text, re.IGNORECASE)
    return match.group() if match else ""

def extract_github(text: str) -> str:
    match = re.search(r"github\.com/[\w\-]+", text, re.IGNORECASE)
    return match.group() if match else ""

def extract_skills(text: str) -> list:
    """Extract technical skills from text using keyword matching."""
    found = []
    text_lower = text.lower()
    for skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.append(skill)
    return list(dict.fromkeys(found))  # Deduplicate while preserving order

def extract_experience_years(text: str) -> float:
    """Extract total years of experience from text."""
    patterns = [
        r"(\d+\.?\d*)\+?\s+years?\s+(?:of\s+)?experience",
        r"experience\s+of\s+(\d+\.?\d*)\+?\s+years?",
        r"(\d+\.?\d*)\+?\s+yrs?\s+(?:of\s+)?exp",
    ]
    for p in patterns:
        match = re.search(p, text, re.IGNORECASE)
        if match:
            return float(match.group(1))
    return 0.0

def extract_name_from_text(text: str) -> str:
    """Extract name from the beginning of a resume."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in lines[:5]:
        # Skip lines that look like contact info
        if re.search(r"[@\+\d]", line):
            continue
        # Skip lines that are all uppercase (likely section headers)
        if line.isupper() and len(line) > 20:
            continue
        # Valid name: 2-4 words, each capitalized, reasonable length
        words = line.split()
        if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words if w) and 5 <= len(line) <= 50:
            return line
    return ""

def extract_education(text: str) -> list:
    """Extract education entries from resume text."""
    edu = []
    patterns = [
        r"(B\.?Tech|B\.?E|M\.?Tech|M\.?E|B\.?Sc|M\.?Sc|BCA|MCA|MBA|PhD|B\.?Com|BA|MA)[\.,\s]+([A-Za-z ]+?)(?:\s+from\s+|\s+at\s+|,\s+)([A-Za-z ]+?)(?:,\s*|\s*\()(\d{4})",
        r"(B\.?Tech|B\.?E|M\.?Tech|M\.?E|B\.?Sc|M\.?Sc|BCA|MCA|MBA|PhD)[\s\S]{0,50}?(\d{4})",
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            edu.append({
                "degree": match.group(1),
                "field": match.group(2).strip() if len(match.groups()) >= 3 else "Computer Science",
                "institution": match.group(3).strip() if len(match.groups()) >= 4 else "",
                "year": match.group(4) if len(match.groups()) >= 4 else match.group(2),
            })
        if edu:
            break
    return edu

def parse_pdf(content: bytes) -> str:
    """Parse PDF using PyMuPDF (fast) or pdfplumber (fallback)."""
    text = ""
    # Try PyMuPDF first
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            text += page.get_text("text") + "\n"
        doc.close()
        if text.strip():
            return text
    except ImportError:
        pass
    except Exception:
        pass

    # Fallback: pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
        return text
    except ImportError:
        pass
    except Exception as e:
        print(f"pdfplumber error: {e}")

    return ""

def parse_docx(content: bytes) -> str:
    """Parse DOCX using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    except ImportError:
        pass
    except Exception as e:
        print(f"DOCX parse error: {e}")
    return ""

def parse_resume(content: bytes, filename: str = "resume.pdf") -> dict:
    """
    Full resume parsing pipeline.
    Returns structured dict with all extracted fields.
    """
    # Extract raw text
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "pdf"
    if ext == "pdf":
        raw_text = parse_pdf(content)
    elif ext in ("docx", "doc"):
        raw_text = parse_docx(content)
    elif ext == "txt":
        raw_text = content.decode("utf-8", errors="ignore")
    else:
        raw_text = content.decode("utf-8", errors="ignore")

    if not raw_text.strip():
        return {"error": "Could not extract text from file", "raw_text": "", "skills": []}

    # Extract all fields
    name = extract_name_from_text(raw_text)
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    skills = extract_skills(raw_text)
    experience_years = extract_experience_years(raw_text)
    education = extract_education(raw_text)
    linkedin_url = extract_linkedin(raw_text)
    github_url = extract_github(raw_text)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "experience_years": experience_years,
        "education": education,
        "linkedin_url": linkedin_url,
        "github_url": github_url,
        "raw_text": raw_text[:8000],  # Limit for AI processing
        "word_count": len(raw_text.split()),
        "char_count": len(raw_text),
    }
