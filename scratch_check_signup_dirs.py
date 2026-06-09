import os
for root, dirs, files in os.walk("app"):
    if "signup" in root or "register" in root:
        print(root)
