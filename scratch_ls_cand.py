import os

directory = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate"
for item in os.listdir(directory):
    if os.path.isdir(os.path.join(directory, item)):
        print(item)
