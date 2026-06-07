# -*- coding: utf-8 -*-
import re

with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("authData.user.id", "authData.user!.id")

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
