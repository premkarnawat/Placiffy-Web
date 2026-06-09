# -*- coding: utf-8 -*-
import os, re

files = [
    "app/company/dashboard/page.tsx",
    "app/company/messages/page.tsx",
    "app/company/candidates/page.tsx",
    "app/company/settings/page.tsx",
    "app/company/support/page.tsx",
    "app/company/billing/page.tsx",
    "app/company/analytics/page.tsx",
    "app/company/reports/page.tsx",
    "app/company/jobs/page.tsx",
    "app/company/jobs/create/page.tsx",
    "app/company/ai-assistant/page.tsx",
    "app/company/workspace/page.tsx"
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # find return (
    match = re.search(r'return\s*\(\s*(.*)', content, re.DOTALL)
    if match:
        ret_block = match.group(1)
        # extract just the first 5 lines of the return block to see the wrapper
        print(f"--- {filepath} ---")
        lines = ret_block.split("\n")[:15]
        for line in lines:
            print(line.rstrip())
        print("------------------\n")
