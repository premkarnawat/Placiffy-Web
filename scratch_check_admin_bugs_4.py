import os

path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        content = f.read()
        import re
        block = re.search(r"const fetchData.*?}", content, re.DOTALL)
        if block:
            print(block.group(0))

print("--------------------------------")
v_path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx"
if os.path.exists(v_path):
    with open(v_path, "r", encoding="utf-8-sig") as f:
        content = f.read()
        block = re.search(r"const handleSubmit.*?}", content, re.DOTALL)
        if block:
            print(block.group(0))

