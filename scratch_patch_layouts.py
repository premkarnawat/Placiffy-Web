# -*- coding: utf-8 -*-
import os
import re

def patch_layout(path, role):
    if not os.path.exists(path):
        return False
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    guard = f"""
  useEffect(() => {{
    if (!isLoading) {{
      if (!user) {{
        router.replace('/login');
      }} else if (user.role !== '{role}') {{
        router.replace(`/${{user.role}}/dashboard`);
      }}
    }}
"""
    
    # We want to replace the current basic useEffect with the strict one
    # Current basic one might look like:
    # useEffect(() => {
    #   if (!isLoading && !user) {
    #     router.push('/login');
    #   }
    
    content = re.sub(
        r'  useEffect\(\(\) => \{\n    if \(!isLoading && !user\) \{\n      router\.push\(\'/login\'\);\n    \}',
        guard,
        content,
        flags=re.DOTALL
    )
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return True

patched_cand = patch_layout(r"app\candidate\layout.tsx", "candidate")
patched_comp = patch_layout(r"app\company\layout.tsx", "company")
patched_admin = patch_layout(r"app\admin\layout.tsx", "admin")

print(f"Candidate Patched: {patched_cand}")
print(f"Company Patched: {patched_comp}")
print(f"Admin Patched: {patched_admin}")
