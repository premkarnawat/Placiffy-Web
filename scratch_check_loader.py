with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "return" in line and "loading" in line.lower() or "if (!data)" in line:
            print(f"Line {i}: {line.strip()}")
