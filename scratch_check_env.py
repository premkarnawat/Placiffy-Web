import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\.env"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        print(".env contents:")
        print(f.read())

filepath_local = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\.env.local"
if os.path.exists(filepath_local):
    with open(filepath_local, "r", encoding="utf-8") as f:
        print("\n.env.local contents:")
        print(f.read())
