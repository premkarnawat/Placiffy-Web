import os

directory = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate"
for root, dirs, files in os.walk(directory):
    for f in files:
        if f.endswith(".tsx"):
            print(os.path.relpath(os.path.join(root, f), directory))
