with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\resume-intelligence\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "fetch(" in line or "fetch`" in line or "/api/candidate/resume-intelligence" in line:
            for j in range(max(0, i-2), min(len(lines), i+3)):
                print(f"{j+1}: {lines[j].rstrip()}")
            print("---")
