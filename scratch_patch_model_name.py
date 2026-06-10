# -*- coding: utf-8 -*-
with open(r"app\api\candidate\parse-resume\route.ts", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update the endpoint URL to use the correct model alias 'gemini-flash-latest'
content = content.replace("gemini-1.5-flash:generateContent", "gemini-flash-latest:generateContent")

with open(r"app\api\candidate\parse-resume\route.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched the Next.js API to use gemini-flash-latest!")
