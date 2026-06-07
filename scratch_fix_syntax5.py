# -*- coding: utf-8 -*-
with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the literal newline that is causing the syntax error
new_content = content.replace('text += page_text + "\n"', 'text += page_text + "\\n"')

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(new_content)
