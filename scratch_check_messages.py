# -*- coding: utf-8 -*-
with open(r"app\company\messages\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'return\s*\(\s*(.*)', content, re.DOTALL)
if match:
    ret_block = match.group(1)
    lines = ret_block.split("\n")[:40]
    for line in lines:
        print(line.rstrip())
