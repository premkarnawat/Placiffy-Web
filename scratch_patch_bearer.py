# -*- coding: utf-8 -*-
import os
import re

files_to_patch = [
    r"app\candidate\dashboard\page.tsx",
    r"app\company\candidates\page.tsx",
    r"app\company\jobs\page.tsx",
    r"app\company\jobs\create\page.tsx"
]

for path in files_to_patch:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace sending session.access_token with token
    content = content.replace("Authorization: `Bearer ${session.access_token}`", "Authorization: `Bearer ${token}`")
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed Bearer token variable!")
