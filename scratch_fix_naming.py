# -*- coding: utf-8 -*-
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace authData with sessionData in the signUp logic
content = content.replace("const { data: authData, error: authError }", "const { data: sessionData, error: authError }")
content = content.replace("!authData.user", "!sessionData.user")
content = content.replace("user_id: authData.user.id", "user_id: sessionData.user.id")

with open(r"app\candidate\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed naming collision in Candidate registration!")
