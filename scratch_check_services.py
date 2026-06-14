import os
for root, dirs, files in os.walk(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\backend\app\services"):
    if "__pycache__" in dirs: dirs.remove("__pycache__")
    for f in files:
        if f.endswith(".py"):
            print(os.path.join(root, f))
