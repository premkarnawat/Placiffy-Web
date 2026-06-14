with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\candidate\resume-intelligence\route.ts", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "Database Save Failed" in line or "supabase.from" in line or "insert(" in line or "upsert(" in line:
            for j in range(max(0, i-2), min(len(lines), i+3)):
                print(f"{j+1}: {lines[j].rstrip()}")
            print("---")
