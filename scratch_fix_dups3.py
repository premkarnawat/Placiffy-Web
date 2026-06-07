# -*- coding: utf-8 -*-
import re

with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace any duplicate const token declarations
content = re.sub(r'const token = authData\.session\.access_token;\s*const token = access_token;', 'const token = authData.session.access_token;', content)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
