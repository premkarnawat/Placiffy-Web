# -*- coding: utf-8 -*-
with open(r"app\company\candidates\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'candidates\s*=\s*\[.*\]', content, re.DOTALL)
if match:
    print("Found hardcoded candidates array!")
else:
    print("No hardcoded candidates array found.")
