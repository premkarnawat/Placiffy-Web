import os
import re

found_keys = {}

def search_env_files():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.startswith(".env"):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        for line in f:
                            if "SUPABASE" in line or "DATABASE_URL" in line:
                                key = line.split("=")[0].strip()
                                found_keys[f"{path}:{key}"] = "***"
                except:
                    pass

search_env_files()
print(found_keys)
