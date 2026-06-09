import os
import re

for root, dirs, files in os.walk(r"backend\app"):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "jobs" in content.lower():
                    print(f"--- Found 'jobs' in {path} ---")
                    lines = content.split("\n")
                    for i, line in enumerate(lines):
                        if "jobs" in line.lower() or "class Job" in line:
                            print(f"L{i}: {line.rstrip()}")
