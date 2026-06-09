# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[50:80]):
    print(f"L{50+i}: {line.rstrip()}")
