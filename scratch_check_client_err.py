with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "Sparkles" in line or "ATS" in line:
            for j in range(max(0, i-2), i+3):
                if j < len(lines):
                    print(f"{j+1}: {lines[j].rstrip()}")
            print("---")
