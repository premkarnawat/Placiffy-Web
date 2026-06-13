with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\settings\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "ShieldCheck" in line:
            print(f"Line {i}: {line.strip()}")
