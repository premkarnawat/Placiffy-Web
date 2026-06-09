# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines):
    if "from('companies').insert" in line or "companyData" in line or "name:" in line or "industry:" in line:
        print(f"L{i}: {line.strip()}")
