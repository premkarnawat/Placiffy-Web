# -*- coding: utf-8 -*-
with open(r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_restructure.sql", "r", encoding="utf-8") as f:
    content = f.read()

import re
lines = content.split('\n')
for i, line in enumerate(lines):
    if "skill" in line.lower():
        print(f"L{i}: {line.strip()}")
