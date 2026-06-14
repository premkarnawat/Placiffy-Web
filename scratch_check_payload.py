with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\candidate\resume-intelligence\route.ts", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i in range(150, 175):
        if i < len(lines):
            print(f"{i+1}: {lines[i].rstrip()}")
