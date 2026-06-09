# -*- coding: utf-8 -*-
import os

env_files = [".env.local", ".env", "backend/.env"]
content = ""
for file in env_files:
    if os.path.exists(file):
        with open(file, "r", encoding="utf-8") as f:
            print(f"--- {file} ---")
            lines = f.readlines()
            for line in lines:
                if "URL" in line or "KEY" in line or "SECRET" in line:
                    # Hide the actual key values for security, just show the keys
                    print(line.split("=")[0] + "=***")
