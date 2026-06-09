# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\company\candidates\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'candidates\.map\(\(c: any, idx: number\).*', content, re.DOTALL)
if match:
    lines = match.group(0).split("\n")[:40]
    for line in lines:
        print(line.rstrip())
else:
    print("Could not find candidate map block")
