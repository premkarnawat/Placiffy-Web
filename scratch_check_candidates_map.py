# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\company\candidates\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines):
    if "candidates.map" in line:
        for j in range(i, min(len(lines), i + 40)):
            print(f"L{j}: {lines[j].rstrip()}")
        break
