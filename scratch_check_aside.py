# -*- coding: utf-8 -*-
import os, re
files = [
    "app/company/messages/page.tsx",
    "app/company/candidates/page.tsx",
    "app/company/workspace/page.tsx",
    "app/company/settings/page.tsx",
    "app/company/dashboard/page.tsx"
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        has_aside = "<aside" in content
        has_min = "min-min-h-screen" in content or "min-h-screen" in content
        print(f"{filepath}: aside={has_aside}, min_h={has_min}")
