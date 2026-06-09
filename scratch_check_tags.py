# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

div_open = content.count("<div")
div_close = content.count("</div")
print(f"<div>: {div_open}, </div>: {div_close}")

a_open = content.count("<a ") + content.count("<a>")
a_close = content.count("</a")
print(f"<a>: {a_open}, </a>: {a_close}")
