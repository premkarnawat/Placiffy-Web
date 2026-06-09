# -*- coding: utf-8 -*-
with open(r"lib\auth-context.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix getSession
content = content.replace(
    "let role = localStorage.getItem('userRole') || 'candidate';",
    "let role = session.user.user_metadata?.role || localStorage.getItem('userRole') || 'candidate';"
)

with open(r"lib\auth-context.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed race condition by preferring session metadata role!")
