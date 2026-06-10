import os

search_dir = r"components"
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if "Sidebar" in file:
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                print(f"--- {file_path} ---")
                lines = content.splitlines()
                for i, line in enumerate(lines):
                    if "href" in line:
                        print(f"L{i}: {line.strip()}")
