import os
for root, dirs, files in os.walk(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api"):
    if "resume-intelligence" in root:
        print("Folder exists:", root)
