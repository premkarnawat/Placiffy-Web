import os

search_dir = r"components"
query1 = "Trust Score"
query2 = "Passport"
query3 = "Verification"

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".tsx"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                if query1.lower() in content.lower() or query2.lower() in content.lower() or query3.lower() in content.lower():
                    print(f"Match found in: {file_path}")
                    for line in content.splitlines():
                        if query1.lower() in line.lower() or query2.lower() in line.lower() or query3.lower() in line.lower():
                            print(f"  {line.strip()}")
