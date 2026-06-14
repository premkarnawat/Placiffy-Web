with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "supabase.from(" in line or "supabase" in line:
            print(f"Line {i}: {line.strip()}")
