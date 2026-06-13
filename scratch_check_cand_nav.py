with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "const navigation =" in line or "const navLinks =" in line or "Shield" in line:
            print(f"Line {i}: {line.strip()}")
            if "const navLinks =" in line or "const navigation =" in line:
                for j in range(i, i+30):
                    if j < len(lines): print(lines[j].strip())
