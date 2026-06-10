# -*- coding: utf-8 -*-
with open(r"app\company\workspace\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace company_users with companies properly
import re
content = re.sub(r"supabase\.from\('company_users'\)\.select\('company_id'\)", "supabase.from('companies').select('id')", content)

with open(r"app\company\workspace\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Actually patched Company Workspace to query 'companies' table!")
