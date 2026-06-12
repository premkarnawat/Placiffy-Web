import os
import re

dir_path = "c:\\Users\\premk\\.gemini\\antigravity\\playground\\ruby-galaxy\\app\\admin"

for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
                
            original_content = content
            
            # Fix missing alt in img tags
            content = re.sub(r'<img(?![^>]*alt=)[^>]*?>', lambda m: m.group(0).replace('<img', '<img alt=""'), content)
            
            # Fix AlertTriangle -> TriangleAlert
            content = content.replace("AlertTriangle", "TriangleAlert")

            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Fixed: {filepath}")
