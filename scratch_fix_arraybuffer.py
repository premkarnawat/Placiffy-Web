# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Patch AutoFill to use Object URLs instead of ArrayBuffer to avoid browser compatibility issues
pdf_fix = """
      const pdfjsLib = await loadPdfJs();
      const fileUrl = URL.createObjectURL(file);
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
"""

content = re.sub(r'      const pdfjsLib = await loadPdfJs\(\);\n      const pdf = await pdfjsLib\.getDocument\(arrayBuffer\)\.promise;', pdf_fix, content, flags=re.DOTALL)
content = content.replace("const arrayBuffer = await file.arrayBuffer();", "") # remove the old line

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Swapped ArrayBuffer for URL.createObjectURL in PDF.js extraction!")
