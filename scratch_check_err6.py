with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\[id]\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[85:105], start=85):
        print(f"Line {i}: {line.strip()}")
