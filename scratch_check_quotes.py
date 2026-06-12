import os
import re

dir_path = "c:\\Users\\premk\\.gemini\\antigravity\\playground\\ruby-galaxy\\app\\admin"

for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
                
            # Naive search for words with apostrophes inside JSX
            # Not perfect, but we can look for typical offenders
            matches = re.findall(r">\s*([^<]*?'[^<]*?)\s*<", content)
            if matches:
                for match in matches:
                    if "'" in match and not match.strip().startswith("{") and not match.strip().endswith("}"):
                        print(f"Possible unescaped quote in {f}: {match.strip()}")

