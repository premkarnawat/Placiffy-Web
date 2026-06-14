with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\backend\app\main.py", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "@app." in line:
            print(f"Line {i}: {line.strip()}")
