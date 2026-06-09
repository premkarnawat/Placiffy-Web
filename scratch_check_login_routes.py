# -*- coding: utf-8 -*-
import os

paths_to_check = [
    r"app\login\page.tsx",
    r"app\company\login\page.tsx",
    r"app\candidate\login\page.tsx",
    r"app\(auth)\login\page.tsx"
]

for p in paths_to_check:
    if os.path.exists(p):
        print(f"--- Found {p} ---")
        with open(p, "r", encoding="utf-8") as f:
            content = f.read()
            lines = content.split("\n")
            for i, line in enumerate(lines[:50]):
                print(f"L{i}: {line.rstrip()}")
