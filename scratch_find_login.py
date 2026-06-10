import os

search_dir = r"app"
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            if "login" in root:
                print(os.path.join(root, file))
