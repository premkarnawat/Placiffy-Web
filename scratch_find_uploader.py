import os

search_dir = r"app"
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                if "/api/candidate/parse-resume" in f.read():
                    print(os.path.join(root, file))
