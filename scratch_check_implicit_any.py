# -*- coding: utf-8 -*-
import os, re

def check_untyped_params(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines):
        # Look for e => , s =>, c =>, inv =>, m => without types
        match = re.search(r'\b([a-zA-Z0-9_]+)\s*=>', line)
        if match:
            param = match.group(1)
            # ignore obvious cases or simple map(e => e) if typescript infers it
            # But just to be sure, let's print them
            print(f"{filepath} L{i+1}: {line.strip()}")
            
        # Also look for (e) => without types
        match2 = re.search(r'\(([a-zA-Z0-9_]+)\)\s*=>', line)
        if match2:
            print(f"{filepath} L{i+1}: {line.strip()}")

for root, dirs, files in os.walk("app/company"):
    for file in files:
        if file.endswith(".tsx"):
            check_untyped_params(os.path.join(root, file))
