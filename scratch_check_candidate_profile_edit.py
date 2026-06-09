# -*- coding: utf-8 -*-
import os

if os.path.exists(r"app\candidate\profile\edit\page.tsx"):
    with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
        content = f.read()
        lines = content.split("\n")
        for i, line in enumerate(lines[:30]):
            print(f"L{i}: {line.rstrip()}")
else:
    print("Does not exist")
