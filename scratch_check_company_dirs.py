import os
def tree(d, p=""):
    if not os.path.isdir(d): return
    for f in os.listdir(d):
        path = os.path.join(d, f)
        print(p + "|-- " + f)
        if os.path.isdir(path): tree(path, p + "    ")

tree(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company")
