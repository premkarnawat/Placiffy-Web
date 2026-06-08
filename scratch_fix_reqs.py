# -*- coding: utf-8 -*-
with open(r"backend\requirements.txt", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("passlib[bcrypt]>=1.7.4", "bcrypt>=4.0.1")

with open(r"backend\requirements.txt", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated requirements.txt")
