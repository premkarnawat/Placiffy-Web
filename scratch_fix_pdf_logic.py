# -*- coding: utf-8 -*-
import re

with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the bad parsing block with PyPDF2
old_pattern = r'try:\s*if filename\.endswith\("\.docx"\) or filename\.endswith\("\.doc"\):.*?# Use Groq to extract details'

new_logic = """try:
            pdf = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf.pages:
                text += page.extract_text() + "\\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not read PDF file: {e}")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text. Please ensure it is a text-based PDF, not an image.")
            
        # Use Groq to extract details"""

# Because regex with literal newlines can be tricky, let's do a substring replace between two known good anchors
start_anchor = '        text = ""'
end_anchor = '        # Use Groq to extract details'

start_idx = content.find(start_anchor)
end_idx = content.find(end_anchor)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx + len(start_anchor) + 1] + """
        try:
            pdf = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf.pages:
                text += page.extract_text() + "\\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not read PDF file: {e}")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text. Please ensure it is a text-based PDF, not an image.")
            
""" + content[end_idx:]
    with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
        f.write(new_content)
else:
    print("Anchors not found")
