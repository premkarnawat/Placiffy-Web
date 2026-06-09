# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[64:85]):
    print(f"L{64+i}: {line.rstrip()}")
