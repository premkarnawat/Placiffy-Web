with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\passports\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "supabase.from('verifications').select('status').eq('user_id', cand.user_id)",
    "supabase.from('candidate_verifications').select('status').eq('candidate_id', cand.id)"
)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\passports\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated admin passports logic")
