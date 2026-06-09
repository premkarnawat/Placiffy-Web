import os
import re

for root, dirs, files in os.walk("app"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "localStorage.getItem(\"token\")" in content or "localStorage.getItem('token')" in content:
                    print(f"--- Found stale token grab in {path} ---")
