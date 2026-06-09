# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will just replace the specific <aside> to </aside> and the <header> to </header> with nothing.
content = re.sub(r'<aside.*?</aside>', '', content, flags=re.DOTALL)
content = re.sub(r'<header.*?</header>', '', content, flags=re.DOTALL)

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Stripped aside and header from dashboard/page.tsx")
