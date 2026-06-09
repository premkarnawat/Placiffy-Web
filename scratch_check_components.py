import os

for root, dirs, files in os.walk("components"):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            print(path)
