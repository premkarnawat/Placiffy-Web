# -*- coding: utf-8 -*-
with open(r"app\company\workspace\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace company_users query
content = content.replace("supabase.from('company_users').select('company_id').eq('user_id', session.user.id).single()", "supabase.from('companies').select('id').eq('user_id', session.user.id).single()")

# Replace cu.company_id with cu.id
content = content.replace("eq('company_id', cu.company_id)", "eq('company_id', cu.id)")

with open(r"app\company\workspace\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched Company Workspace to query 'companies' table instead of non-existent 'company_users'!")
