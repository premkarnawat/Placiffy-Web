# -*- coding: utf-8 -*-
files = [
    r"app\candidate\profile\edit\page.tsx",
    r"app\candidate\messages\page.tsx",
    r"app\admin\messages\page.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("loading: authLoading", "isLoading: authLoading")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Replaced loading with isLoading!")
