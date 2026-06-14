with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

import re

# Fix query
content = re.sub(
    r"candidates!inner\([\s\S]*?\)",
    "candidates!inner(*)",
    content
)

# Fix object references
content = content.replace("cand.candidate_profiles?.[0]?.experience", "cand.experience_years")
content = content.replace("cand.passports?.[0]?.trust_score", "cand.trust_score")
content = content.replace("cand.resume_intelligence_reports?.[0]?.ats_resume_score", "app.ats_score || cand.trust_score")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Applicants fixed")
