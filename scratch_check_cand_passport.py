with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "full_name" in line or "text-3xl" in line or "Shield" in line or "verified" in line.lower():
            print(f"Line {i}: {line.strip()}")
