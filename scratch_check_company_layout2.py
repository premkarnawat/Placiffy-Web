# -*- coding: utf-8 -*-
with open(r"app\company\layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[30:60]):
    print(f"L{30+i}: {line.rstrip()}")
