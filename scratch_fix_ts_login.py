# -*- coding: utf-8 -*-
with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("email: authData.user.email,", "email: authData.user.email || '',")

with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
