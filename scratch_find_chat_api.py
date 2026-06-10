import os

search_dir = r"app"
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if "route.ts" in file or "route.js" in file:
            print(os.path.join(root, file))
