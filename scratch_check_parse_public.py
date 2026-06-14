with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\backend\app\main.py", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i in range(240, 260):
        if i < len(lines):
            print(f"Line {i}: {lines[i].rstrip()}")
