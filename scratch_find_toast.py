import os

path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app"
for root, dirs, files in os.walk(path):
    for f in files:
        if f.endswith(".tsx"):
            full_path = os.path.join(root, f)
            with open(full_path, "r", encoding="utf-8-sig") as file:
                lines = file.readlines()
                for i, line in enumerate(lines):
                    if "useToast" in line and "import" in line:
                        print(f"{f}: {line.strip()}")
