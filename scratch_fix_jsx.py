# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the unclosed <a> tag that is causing the JSX parser to throw an error at line 156
content = content.replace(
    '<a href="/company/dashboard" className="flex items-center gap-2 cursor-pointer">',
    '<div className="flex items-center gap-2">'
)

# Fix the unescaped apostrophe in "what's" which will definitely crash Vercel too!
content = content.replace("what's", "what&apos;s")

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed JSX Syntax Error in Dashboard")
