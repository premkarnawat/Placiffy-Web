import os

filepath = "c:\\Users\\premk\\.gemini\\antigravity\\playground\\ruby-galaxy\\app\\admin\\layout.tsx"
with open(filepath, "r", encoding="utf-8") as file:
    content = file.read()

# Fix the user_metadata error
content = content.replace("user.user_metadata?.role", "user.role")

with open(filepath, "w", encoding="utf-8") as file:
    file.write(content)
print("Fixed layout.tsx")
