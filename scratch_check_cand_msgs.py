with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\messages\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    print([line for line in content.split("\n") if "supabase" in line])
