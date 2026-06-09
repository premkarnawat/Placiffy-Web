# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[80:100]):
    print(f"L{80+i}: {line.rstrip()}")
