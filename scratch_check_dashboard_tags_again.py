# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
tags = re.finditer(r'<(/?div)[^>]*>', content)
for i, tag in enumerate(tags):
    print(f"{i}: {tag.group(0)} at pos {tag.start()}")
    if i > 5: break
