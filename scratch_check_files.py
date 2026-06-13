import os
files = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\analytics\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\messages\page.tsx"
]
for f in files:
    print(f"\n--- {f} ---")
    if os.path.exists(f):
        print("EXISTS")
    else:
        print("MISSING")
