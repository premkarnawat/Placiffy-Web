import os

filepath = "c:\\Users\\premk\\.gemini\\antigravity\\playground\\ruby-galaxy\\app\\admin\\login\\page.tsx"
with open(filepath, "r", encoding="utf-8") as file:
    content = file.read()

if not content.startswith('"use client";') and not content.startswith("'use client';"):
    content = '"use client";\n' + content
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(content)
    print("Fixed missing 'use client' directive in login page.")
else:
    print("Already has 'use client' directive.")

