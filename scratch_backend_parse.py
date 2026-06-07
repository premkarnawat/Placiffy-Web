# -*- coding: utf-8 -*-
with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

new_endpoint = """
@app.post("/api/resume/parse-public", tags=["Candidate"])
async def parse_resume_public(file: UploadFile = File(...)):
    content = await file.read()
    # In a real app, parse the PDF here using PyPDF2 or similar.
    # For now, return mock parsed data
    return {
        "status": "success",
        "extracted_data": {
            "fullName": "Alex Montgomery",
            "email": "alex.m@example.design",
            "headline": "Senior Product Designer",
            "skills": "React, TypeScript, Figma, UI/UX",
            "location": "San Francisco, CA"
        }
    }
"""

content = content.replace("# --- CANDIDATE ENDPOINTS ---", "# --- CANDIDATE ENDPOINTS ---" + new_endpoint)

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(content)
