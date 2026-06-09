# -*- coding: utf-8 -*-
import os

paths_to_check = [
    r"app\login\page.tsx",
    r"app\company\login\page.tsx",
    r"app\candidate\login\page.tsx"
]

for p in paths_to_check:
    if os.path.exists(p):
        print(f"{p} exists!")
    else:
        print(f"{p} does not exist.")
