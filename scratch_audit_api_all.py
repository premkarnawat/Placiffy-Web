import os

search_dir = r"app\api"
if os.path.exists(search_dir):
    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if "route" in file:
                print(os.path.join(root, file))
else:
    print("app/api not found")
