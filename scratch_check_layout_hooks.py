# -*- coding: utf-8 -*-
with open(r"app\company\layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[25:50]):
    print(f"L{25+i}: {line.rstrip()}")
