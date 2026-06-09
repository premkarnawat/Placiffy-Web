# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Simple tag extraction
# We will just look at `<div` and `</div`
tags = re.findall(r'<(/?div)[^>]*>', content)
depth = 0
for i, tag in enumerate(tags):
    if tag == "div":
        depth += 1
    elif tag == "/div":
        depth -= 1
    if depth < 0:
        print(f"Depth became negative at tag index {i}! (It was a {tag})")

print(f"Final depth: {depth}")
