# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'Hiring Funnel Performance.*', content, re.DOTALL)
if match:
    lines = match.group(0).split("\n")[:40]
    for line in lines:
        print(line.rstrip())
