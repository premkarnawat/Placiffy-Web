# -*- coding: utf-8 -*-
with open(r"backend\app\auth.py", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[:15]):
    print(f"L{i}: {line.strip()}")
