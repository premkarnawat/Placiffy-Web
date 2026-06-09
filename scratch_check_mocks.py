import os
import re

for root, dirs, files in os.walk("app"):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "mock" in content.lower() or "dummy" in content.lower():
                    print(f"Found 'mock/dummy' in {path}")
