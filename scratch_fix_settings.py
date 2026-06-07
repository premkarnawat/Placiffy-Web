# -*- coding: utf-8 -*-
with open(r"app\candidate\settings\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Shield, Lock, Bell, Database, Save, CheckCircle", "Shield, Lock, Bell, Database, Save, CheckCircle, Settings")

with open(r"app\candidate\settings\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
