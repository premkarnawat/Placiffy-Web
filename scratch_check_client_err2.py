with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "import" in line and "lucide-react" in line:
            print(f"{i+1}: {line.rstrip()}")
