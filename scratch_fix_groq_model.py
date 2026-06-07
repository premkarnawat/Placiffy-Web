# -*- coding: utf-8 -*-
with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('model="llama3-8b-8192",', 'model="llama-3.3-70b-versatile",')

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(content)
