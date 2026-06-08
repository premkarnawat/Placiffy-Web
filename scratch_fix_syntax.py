# -*- coding: utf-8 -*-
with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("text += extracted + \"\n\"", "text += extracted + \"\\n\"")
content = content.replace("text += para.text + \"\n\"", "text += para.text + \"\\n\"")

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed syntax error")
