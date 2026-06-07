# -*- coding: utf-8 -*-
with open(r"app\candidate\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the potential null reference error
content = content.replace("const pct = data.cand.profile_completion_pct || 0;", "const pct = data.cand?.profile_completion_pct || 0;")
content = content.replace("const isVerified = data.cand.verification_status === 'verified';", "const isVerified = data.cand?.verification_status === 'verified';")

with open(r"app\candidate\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
