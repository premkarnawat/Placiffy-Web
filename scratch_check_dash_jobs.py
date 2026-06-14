with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "Jobs Matched For You" in line or "match" in line.lower() or "zap" in line.lower() or "apply now" in line.lower():
            print(f"{i+1}: {line.strip()}")
