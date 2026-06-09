# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\company\ai-assistant\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'const sendMessage = async.*?\}', content, re.DOTALL)
if match:
    print(match.group(0))
