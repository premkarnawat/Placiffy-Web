# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Safely replace the failing getDocument line
patch = """
      const pdfjsLib = await loadPdfJs();
      const fileUrl = URL.createObjectURL(file);
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
"""

content = re.sub(r'      const pdfjsLib = await loadPdfJs\(\);[\s\n]*const pdf = await pdfjsLib\.getDocument\(arrayBuffer\)\.promise;', patch, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully replaced the lingering arrayBuffer reference with URL.createObjectURL!")
