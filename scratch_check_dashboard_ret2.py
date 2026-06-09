# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'return\s*\(\s*<div className="p-6">.*', content, re.DOTALL)
if match:
    ret = match.group(0).split("\n")[:10]
    for r in ret:
        print(r.rstrip())
else:
    print("Could not find the component return!")
