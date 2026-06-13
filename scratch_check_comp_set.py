with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\settings\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[:150]):
        if "text-3xl" in line or "verification_badge" in line or "Shield" in line or "full_name" in line or "name" in line.lower():
            print(f"Line {i}: {line.strip()}")
