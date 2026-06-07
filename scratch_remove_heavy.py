# -*- coding: utf-8 -*-
with open(r"backend\requirements.txt", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
new_lines = [line for line in lines if not line.startswith("pdfplumber") and not line.startswith("python-docx")]

with open(r"backend\requirements.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(new_lines))
