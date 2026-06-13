with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\[id]\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "isVerified" in line:
            print(f"Line {i}: {line.strip()}")
