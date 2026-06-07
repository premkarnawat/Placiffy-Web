# -*- coding: utf-8 -*-
with open(r"app\candidate\support\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("priority: 'normal'\n        });", "priority: 'normal'\n        }).select().single();")

with open(r"app\candidate\support\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
