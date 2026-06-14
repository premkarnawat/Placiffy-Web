import os

directory = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin"
admin_files = []

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            path = os.path.relpath(os.path.join(root, file), directory)
            admin_files.append(path)

print("Admin Files:")
for f in sorted(admin_files):
    print(" -", f)
