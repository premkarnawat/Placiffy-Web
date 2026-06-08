# -*- coding: utf-8 -*-
import os, re

def check_unused_state(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # find useState declarations: const [var, setVar] = useState...
    states = re.findall(r'const\s+\[([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\]\s*=\s*useState', content)
    
    for var_name, set_name in states:
        var_matches = len(re.findall(r'\b' + re.escape(var_name) + r'\b', content))
        set_matches = len(re.findall(r'\b' + re.escape(set_name) + r'\b', content))
        
        if var_matches <= 1:
            print(f"File {filepath} has unused state variable: {var_name}")
        if set_matches <= 1:
            print(f"File {filepath} has unused setter: {set_name}")

for root, dirs, files in os.walk("app/company"):
    for file in files:
        if file.endswith(".tsx"):
            check_unused_state(os.path.join(root, file))
