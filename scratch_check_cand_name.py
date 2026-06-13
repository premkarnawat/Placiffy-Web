with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "text-3xl font-bold" in line or "full_name" in line or "badge" in line.lower() or "candidateData.full_name" in line:
            print(f"Line {i}: {line.strip()}")
