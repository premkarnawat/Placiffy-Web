import os
for root, dirs, files in os.walk(r"backend\app"):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "jwt.decode" in content:
                    print(f"--- Found jwt.decode in {path} ---")
                    lines = content.split("\n")
                    for i, line in enumerate(lines):
                        if "jwt.decode" in line:
                            print(f"L{i}: {line.rstrip()}")
