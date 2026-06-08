# -*- coding: utf-8 -*-
import os, re

def check_unused_imports(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # find imports from lucide-react
    imports = re.findall(r'import\s+\{([^}]+)\}\s+from\s+["\']lucide-react["\']', content)
    unused = []
    
    for imp in imports:
        icons = [i.strip().split(' as ')[-1].strip() for i in imp.split(',')]
        for icon in icons:
            if not icon: continue
            # Count occurrences of the icon in the file
            # One occurrence is the import itself. If it's used, count > 1
            matches = re.findall(r'\b' + re.escape(icon) + r'\b', content)
            if len(matches) <= 1:
                unused.append(icon)
                
    if unused:
        print(f"File {filepath} has unused imports: {', '.join(unused)}")
        # Let's fix it automatically!
        for icon in unused:
            content = re.sub(r'\b' + re.escape(icon) + r'\s*,\s*', '', content)
            content = re.sub(r',\s*\b' + re.escape(icon) + r'\b', '', content)
            content = re.sub(r'\{\s*' + re.escape(icon) + r'\s*\}', '{}', content)
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  -> Fixed!")

for root, dirs, files in os.walk("app/company"):
    for file in files:
        if file.endswith(".tsx"):
            check_unused_imports(os.path.join(root, file))
