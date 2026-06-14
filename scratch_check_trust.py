with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\trust-score\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i in range(25):
        if i < len(lines):
            print(f"{i+1}: {lines[i].rstrip()}")
