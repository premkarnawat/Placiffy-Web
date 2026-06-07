# -*- coding: utf-8 -*-
with open(r"app\candidate\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("skill: str", "skill: string")

with open(r"app\candidate\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
