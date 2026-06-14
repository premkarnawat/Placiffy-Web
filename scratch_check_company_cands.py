with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "score" in line.lower() or "zap" in line.lower() or "trust" in line.lower():
            print(f"{i+1}: {line.strip()}")
