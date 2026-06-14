with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i in range(20):
        if i < len(lines):
            print(f"{i+1}: {lines[i].rstrip()}")
