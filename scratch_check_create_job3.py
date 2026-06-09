# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[110:150]):
    print(f"L{110+i}: {line.rstrip()}")
