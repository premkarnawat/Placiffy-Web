with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace("overall_score, grade", "ats_resume_score")

old_data = "ats_score: cand.profile_completion_pct || 0,"
new_data = "ats_score: cand.profile_completion_pct || 0,\n          resume_intel_score: intel?.ats_resume_score || null,"

content = content.replace(old_data, new_data)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched passport page")
