with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

import re

# Update query to fetch ATS score
content = content.replace(
    "candidates!inner(*)",
    "candidates!inner(*, resume_intelligence_reports(ats_resume_score))"
)

# Replace the fallback
# <div className="text-xl font-black text-blue-600">{app.ats_score || cand.trust_score || 'N/A'}<span className="text-xs text-blue-400 font-bold ml-0.5">%</span></div>
old_render = "{app.ats_score || cand.trust_score || 'N/A'}"
new_render = "{app.ats_score || cand.resume_intelligence_reports?.[0]?.ats_resume_score || cand.resume_intelligence_reports?.ats_resume_score || 'N/A'}"
content = content.replace(old_render, new_render)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed Applicants ATS Intel")
