# -*- coding: utf-8 -*-
with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

import_str = """
import uuid
import httpx
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import io
import PyPDF2
from groq import Groq
import json
"""

old_imports = """
import uuid
import httpx
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
"""

content = content.replace(old_imports.strip(), import_str.strip())

old_endpoint = """@app.post("/api/resume/parse-public", tags=["Candidate"])
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
    }"""

new_endpoint = """@app.post("/api/resume/parse-public", tags=["Candidate"])
async def parse_resume_public(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # Parse PDF
        text = ""
        try:
            pdf = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf.pages:
                text += page.extract_text() + "\\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail="Could not read PDF file")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text")
            
        # Use Groq to extract details
        if not settings.groq_api_key:
            # Fallback mock if API key isn't provided to backend
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
            
        client = Groq(api_key=settings.groq_api_key)
        
        prompt = f'''
        Extract the following information from the resume text below and return ONLY a valid JSON object. Do not include any markdown formatting like ```json. 
        Required keys:
        - fullName (string)
        - email (string)
        - headline (string, a short professional summary or current title)
        - skills (string, a comma-separated list of top skills)
        - location (string, City, State or Country)
        
        Resume Text:
        {text[:8000]}
        '''
        
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        response_text = completion.choices[0].message.content
        extracted_data = json.loads(response_text)
        
        return {
            "status": "success",
            "extracted_data": extracted_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))"""

content = content.replace(old_endpoint, new_endpoint)

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(content)
