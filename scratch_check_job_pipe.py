import os
path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\jobs\[id]\page.tsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        print(f.read()[:1500])
else:
    print("File does not exist")
