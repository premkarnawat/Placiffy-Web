# -*- coding: utf-8 -*-
files = [
    r"app\candidate\messages\page.tsx",
    r"app\admin\messages\page.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("user.id", "user?.id")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixed user?.id typescript errors!")
