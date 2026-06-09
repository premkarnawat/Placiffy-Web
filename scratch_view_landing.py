# -*- coding: utf-8 -*-
with open(r"app\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
lines = content.split('\n')
for i, line in enumerate(lines[:30]):
    print(f"L{i}: {line.strip()}")
