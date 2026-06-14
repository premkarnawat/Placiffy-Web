with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\profile\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "supabase" in line and "select" in line:
            print(line.strip())
