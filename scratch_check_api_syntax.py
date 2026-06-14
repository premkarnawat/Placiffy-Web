with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\candidate\resume-intelligence\route.ts", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "join('" in line:
            for j in range(i-2, i+3):
                if j < len(lines):
                    print(f"{j+1}: {lines[j].rstrip()}")
            print("---")
