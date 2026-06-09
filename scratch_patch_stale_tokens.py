# -*- coding: utf-8 -*-
import os
import re

files_to_patch = [
    r"app\candidate\dashboard\page.tsx",
    r"app\company\candidates\page.tsx",
    r"app\company\jobs\page.tsx"
]

patch_code = """      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || localStorage.getItem("token");"""

for path in files_to_patch:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace simple localStorage grabs
    content = re.sub(r'\s*const token = localStorage\.getItem\("token"\);', '\n' + patch_code, content)
    
    # Ensure supabase is imported if not present
    if "import { supabase }" not in content:
        content = content.replace("import { useAuth } from '@/lib/auth-context';", "import { useAuth } from '@/lib/auth-context';\nimport { supabase } from '@/lib/supabase';")
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Patched stale tokens globally!")
