with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "toLocaleDateString" in line:
            print(f"Line {i}: {line.strip()}")
