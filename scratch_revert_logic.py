# -*- coding: utf-8 -*-
import re

with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

# Remove pdfplumber and docx imports
content = content.replace("import pdfplumber\n", "")
content = content.replace("import docx\n", "")

old_logic = """        try:
            if filename.endswith(".docx") or filename.endswith(".doc"):
                doc = docx.Document(io.BytesIO(content))
                text = "\\n".join([para.text for para in doc.paragraphs])
            else:
                # Default to PDF
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not read file {filename}: {str(e)}")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Document contains no readable text. Please ensure it is a text-based document, not a scanned image.")"""

new_logic = """        try:
            pdf = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf.pages:
                text += page.extract_text() + "\\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not read PDF file: {e}")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text. Please ensure it is a text-based PDF, not an image.")"""

content = content.replace(old_logic, new_logic)

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(content)
