# -*- coding: utf-8 -*-
import re

def patch_registration_auto_login(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add small delay before router.push to ensure context propagation
    content = re.sub(
        r'(toast\("success", "Registration Successful", "Welcome to Placify!"\);\n\s*)(router\.push\(".*?/dashboard"\);)',
        r'\1await new Promise(resolve => setTimeout(resolve, 100));\n      \2',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

patch_registration_auto_login(r"app\candidate\register\page.tsx")
patch_registration_auto_login(r"app\company\register\page.tsx")

print("Added async context sync delay to registration auto-login flows!")
