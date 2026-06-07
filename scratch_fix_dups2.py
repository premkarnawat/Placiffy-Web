# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("        // 2. Update Profile\n        const token = authData.session.access_token;\n        const token = access_token;", "        // 2. Update Profile\n        const token = authData.session.access_token;")
content = content.replace("        const token = authData.session.access_token;\n\n        const token = access_token;", "        const token = authData.session.access_token;")
content = content.replace("const token = authData.session.access_token;\n        const token = access_token;", "const token = authData.session.access_token;")

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
