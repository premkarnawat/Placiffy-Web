# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'const handleSubmit = async.*', content, flags=re.DOTALL)
if match:
    print(match.group(0)[:1500])
