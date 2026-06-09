# -*- coding: utf-8 -*-
with open(r"lib\auth-context.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[:45]):
    print(f"L{i}: {line.rstrip()}")
