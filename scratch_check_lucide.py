# -*- coding: utf-8 -*-
import os, re

lucide_exports = []
# Try to find lucide-react exports if node_modules exists
lucide_path = r"node_modules\lucide-react\dist\lucide-react.d.ts"
if os.path.exists(lucide_path):
    with open(lucide_path, "r", encoding="utf-8") as f:
        content = f.read()
        lucide_exports = re.findall(r'export\s+(?:declare\s+const|const)\s+([A-Z][a-zA-Z0-9_]+)', content)
else:
    print("lucide-react type definitions not found locally.")

for root, dirs, files in os.walk("app/company"):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            imports = re.findall(r'import\s+\{([^}]+)\}\s+from\s+["\']lucide-react["\']', content)
            for imp in imports:
                # split by comma, strip whitespace, handle 'as' aliases
                icons = [i.strip().split(' as ')[0].strip() for i in imp.split(',')]
                for icon in icons:
                    if icon and lucide_exports and icon not in lucide_exports:
                        print(f"File {filepath} imports {icon} which may not exist in lucide-react")
                    elif icon:
                        print(f"File {filepath} imports {icon}")
