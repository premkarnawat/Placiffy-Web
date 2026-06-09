import os
import re

for root, dirs, files in os.walk("app"):
    if "page.tsx" in files:
        path = os.path.join(root, "page.tsx")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            if "/register" in content:
                print(f"Found link to /register in {path}")
