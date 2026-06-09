# -*- coding: utf-8 -*-
with open(r"lib\auth-context.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[55:90]):
    print(f"L{55+i}: {line.rstrip()}")
