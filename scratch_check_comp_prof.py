with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\profile\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[:100]):
        if "text-3xl font-bold" in line or "verification_badge" in line or "Shield" in line:
            print(f"Line {i}: {line.strip()}")
