# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'await supabase\.from\(\'companies\'\)\.insert\(\{.*?\}\)', content, flags=re.DOTALL)
if match:
    print(match.group(0))
