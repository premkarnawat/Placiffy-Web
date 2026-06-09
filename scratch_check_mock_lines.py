# -*- coding: utf-8 -*-
with open(r"app\candidate\messages\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines):
    if "mock" in line.lower() or "dummy" in line.lower():
        print(f"L{i}: {line.strip()}")
