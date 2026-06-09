# -*- coding: utf-8 -*-
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[110:130]):
    print(f"L{110+i}: {line.rstrip()}")
