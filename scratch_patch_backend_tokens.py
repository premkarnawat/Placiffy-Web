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
    
    # Ensure import is present
    if "getBackendToken" not in content:
        content = content.replace("import { supabase } from '@/lib/supabase';", "import { supabase } from '@/lib/supabase';\nimport { getBackendToken } from '@/lib/backend-auth';")
    
    if "company" in path:
        role = "company"
    else:
        role = "candidate"
        
    # Replace the token fetch
    patch_code = f"""      const {{ data: {{ session }} }} = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      const token = await getBackendToken({{ id: session.user.id, email: session.user.email || '', role: '{role}' }});"""

    # For files where we previously patched token fetching:
    content = re.sub(r'\s*const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);\s*const token = session\?\.access_token \|\| localStorage\.getItem\("token"\);', '\n' + patch_code, content)
    
    # For job creator:
    content = re.sub(r'\s*const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);\s*if \(!session\) throw new Error\("Authentication required"\);\s*const API_URL', '\n' + patch_code + '\n      const API_URL', content)

    # For ATS matcher specifically if it uses a different pattern:
    content = re.sub(r'\s*const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);\s*const token = session\?\.access_token \|\| localStorage\.getItem\("token"\);', '\n' + patch_code, content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Patched all API calls to use custom generated backend token!")
