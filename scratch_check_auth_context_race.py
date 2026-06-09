# -*- coding: utf-8 -*-
with open(r"lib\auth-context.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[60:85]):
    print(f"L{60+i}: {line.rstrip()}")
