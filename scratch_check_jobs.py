with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "Zap" in line or "Match" in line or "match" in line.lower() or "score" in line.lower():
            print(f"{i+1}: {line.strip()}")
