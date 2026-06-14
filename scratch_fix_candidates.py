with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

import re

# Fix query
content = re.sub(
    r"await supabase\.from\('candidates'\)\.select\(`.*?`\)",
    "await supabase.from('candidates').select(`*`)",
    content,
    flags=re.DOTALL
)

# Fix object access
content = content.replace("c.candidate_profiles?.[0]?.skills", "c.skills")
content = content.replace("c.candidate_profiles?.[0]?.experience", "c.experience_years")
content = content.replace("c.passports?.[0]?.verification_status === 'Verified'", "c.verification_badge === true")
content = content.replace("c.resume_intelligence_reports?.[0]?.ats_resume_score", "c.trust_score") # fallback to trust score if ats doesn't exist natively

content = content.replace("cand.candidate_profiles?.[0]", "cand")
content = content.replace("cand.passports?.[0]", "cand")
content = content.replace("cand.resume_intelligence_reports?.[0]", "cand")

# Update verification check
content = content.replace("passport?.verification_status === 'Verified'", "cand.verification_badge === true")

# Update intel
content = content.replace("intel?.ats_resume_score", "cand.trust_score")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Candidates fixed")
