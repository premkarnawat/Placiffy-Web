# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("activeTab === 'certifications'", "activeSection === 'certifications'")
content = content.replace("activeTab === 'courses'", "activeSection === 'courses'")

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
