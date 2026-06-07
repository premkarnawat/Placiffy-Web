# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "if (!res.ok) throw new Error('Failed to parse resume');",
    "if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Failed to parse resume'); }"
)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
