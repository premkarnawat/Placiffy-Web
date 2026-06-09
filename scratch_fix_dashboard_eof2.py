# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
content = re.sub(r'\s*\);\s*\}', '\n      </div>\n  );\n}', content)

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added missing closing div")
