# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'return\s*\(\s*(.*)', content, re.DOTALL)
if match:
    ret = match.group(1).split("\n")[:10]
    for r in ret:
        print(r)
