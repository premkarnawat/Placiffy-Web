with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[65:85], start=65):
        print(f"{i}: {line.rstrip()}")
