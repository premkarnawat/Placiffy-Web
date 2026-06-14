with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "if (!data)" in line:
            print(f"Found on line {i+1}: {line.rstrip()}")
        if "getColorStyles" in line:
            print(f"Found on line {i+1}: {line.rstrip()}")
