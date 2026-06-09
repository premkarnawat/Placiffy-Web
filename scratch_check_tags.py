# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
a_tags = len(re.findall(r'<a\b', content))
close_a_tags = len(re.findall(r'</a>', content))
div_tags = len(re.findall(r'<div\b', content))
close_div_tags = len(re.findall(r'</div>', content))

print(f"<a>: {a_tags}, </a>: {close_a_tags}")
print(f"<div>: {div_tags}, </div>: {close_div_tags}")
