# -*- coding: utf-8 -*-
with open(r"app\company\layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'useEffect\(\(\) => \{.*?\}, \[user, isLoading, router\]\);', content, flags=re.DOTALL)
if match:
    print("--- CompanyLayout useEffect ---")
    print(match.group(0))

match2 = re.search(r'if \(isLoading \|\| !user.*?\{', content, flags=re.DOTALL)
if match2:
    print("\n--- CompanyLayout condition ---")
    print(match2.group(0))
