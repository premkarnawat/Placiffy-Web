# -*- coding: utf-8 -*-
with open(r"app\candidate\support\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "const { data, error } = await supabase.from('support_tickets').insert({",
    "const { data, error } = await supabase.from('support_tickets').insert({"
)

# Actually, let's just do a clean replace for the exact snippet
import re

content = re.sub(
    r"const \{ data, error \} = await supabase\.from\('support_tickets'\)\.insert\(\{(.*?)\}\);",
    r"const { data, error } = await supabase.from('support_tickets').insert({\1}).select().single();",
    content,
    flags=re.DOTALL
)

with open(r"app\candidate\support\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
