# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\company\messages\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'const loadMessages = async.*?\}', content, re.DOTALL)
if match:
    print("--- loadMessages ---")
    print(match.group(0))

match2 = re.search(r'const sendMessage = async.*?\}', content, re.DOTALL)
if match2:
    print("\n--- sendMessage ---")
    print(match2.group(0))
    
match3 = re.search(r'useEffect\(\(\) => \{.*?\}, \[user\]\);', content, re.DOTALL)
if match3:
    print("\n--- useEffect ---")
    print(match3.group(0))
