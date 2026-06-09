# -*- coding: utf-8 -*-
import os
import re

def patch_layout_register_exception(path, role):
    if not os.path.exists(path):
        return False
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    guard = f"""
  useEffect(() => {{
    if (pathname.endsWith('/register')) return; // Allow public access to registration
    if (!isLoading) {{
      if (!user) {{
        router.replace('/login');
      }} else if (user.role !== '{role}') {{
        router.replace(`/${{user.role}}/dashboard`);
      }}
    }}
"""
    
    # Replace the current guard
    content = re.sub(
        r'  useEffect\(\(\) => \{\n    if \(!isLoading\) \{\n      if \(!user\) \{\n        router\.replace\(\'/login\'\);\n      \} else if \(user\.role !== \'.*?\'\) \{\n        router\.replace\(`/\$\{user\.role\}/dashboard`\);\n      \}\n    \}',
        guard,
        content,
        flags=re.DOTALL
    )
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return True

patched_cand = patch_layout_register_exception(r"app\candidate\layout.tsx", "candidate")
patched_comp = patch_layout_register_exception(r"app\company\layout.tsx", "company")

print(f"Candidate Layout Patched: {patched_cand}")
print(f"Company Layout Patched: {patched_comp}")
