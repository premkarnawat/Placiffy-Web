# -*- coding: utf-8 -*-
with open(r"backend\requirements.txt", "r", encoding="utf-8") as f:
    content = f.read()

if "pdfplumber" not in content:
    content += "\npdfplumber>=0.10.0"
if "python-docx" not in content:
    content += "\npython-docx>=1.1.0"

with open(r"backend\requirements.txt", "w", encoding="utf-8") as f:
    f.write(content)
