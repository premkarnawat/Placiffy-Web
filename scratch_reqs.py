# -*- coding: utf-8 -*-
with open(r"backend\requirements.txt", "r", encoding="utf-8") as f:
    content = f.read()

if "PyPDF2" not in content:
    content += "\nPyPDF2>=3.0.0"

with open(r"backend\requirements.txt", "w", encoding="utf-8") as f:
    f.write(content)
