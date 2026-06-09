import os

found = False
for root, dirs, files in os.walk("app"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "components/dashboard" in content:
                    print(f"Found in {path}")
                    found = True

if not found:
    print("No references found!")
