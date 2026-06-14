import os
for root, dirs, files in os.walk(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api"):
    for f in files:
        if f == "route.ts":
            print(os.path.join(root, f))
