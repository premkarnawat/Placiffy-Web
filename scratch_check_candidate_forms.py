# -*- coding: utf-8 -*-
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

print("Consent Checkbox found:", "consent" in content.lower() or "terms" in content.lower())
print("Resume Upload found:", "resume" in content.lower() or "file" in content.lower())
