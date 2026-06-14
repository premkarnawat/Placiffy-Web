import os
path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company"
for root, dirs, files in os.walk(path):
    for f in files:
        if f.endswith("page.tsx") and "candidate" in root:
            print(os.path.join(root, f))
