import os

directory = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy"
for root, dirs, files in os.walk(directory):
    if "node_modules" in dirs: dirs.remove("node_modules")
    if ".next" in dirs: dirs.remove(".next")
    if ".git" in dirs: dirs.remove(".git")
    for f in files:
        if "env" in f.lower() or "database" in f.lower() or "config" in f.lower():
            print(os.path.join(root, f))
