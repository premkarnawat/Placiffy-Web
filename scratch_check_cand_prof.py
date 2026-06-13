with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\profile\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[:150]):
        if "badge" in line.lower() or "candidate.full_name" in line:
            print(f"Line {i}: {line.strip()}")
        if "candidates" in line and "select" in line:
            print(f"Line {i}: {line.strip()}")
