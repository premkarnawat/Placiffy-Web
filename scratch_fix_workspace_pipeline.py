# -*- coding: utf-8 -*-
with open(r"app\company\workspace\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Fix empty array crash in fetchPipeline
content = content.replace(
    "const candIds = apps.map((a: any) => a.candidate_id);\n      const { data: cands } = await supabase.from('candidates').select('*').in('id', candIds);",
    "const candIds = apps.map((a: any) => a.candidate_id);\n      if (candIds.length === 0) { setApplications([]); return; }\n      const { data: cands } = await supabase.from('candidates').select('*').in('id', candIds);"
)

with open(r"app\company\workspace\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched fetchPipeline empty array crash!")
