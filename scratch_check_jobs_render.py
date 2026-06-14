with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i in range(295, 335):
        if i <= len(lines):
            print(f"{i}: {lines[i-1].rstrip()}")
