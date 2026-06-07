# -*- coding: utf-8 -*-
with open(r"app\candidate\support\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We want to find: const { data, error } = await supabase.from('support_tickets').insert({ ... })
# and append .select().single() to the end of the statement before the semicolon or newline.

content = re.sub(
    r"(await supabase\.from\('support_tickets'\)\.insert\(\{.*?\})(\s*;|\n)",
    r"\1.select().single()\2",
    content,
    flags=re.DOTALL
)

with open(r"app\candidate\support\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
