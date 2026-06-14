with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

import re

# Update query to fetch ATS score
content = content.replace(
    "await supabase.from('candidates').select(`*`)",
    "await supabase.from('candidates').select(`*, resume_intelligence_reports(ats_resume_score)`)"
)

# Fix the render: replace the fallback "cand.trust_score" back to the actual object
# We need to find: <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ATS Intel</div>\n                    <div className="text-xl font-black text-blue-600">{cand.trust_score || 'N/A'}
old_ats_render = "<div className=\"text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1\">ATS Intel</div>\n                    <div className=\"text-xl font-black text-blue-600\">{cand.trust_score || 'N/A'}"
new_ats_render = "<div className=\"text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1\">ATS Intel</div>\n                    <div className=\"text-xl font-black text-blue-600\">{cand.resume_intelligence_reports?.[0]?.ats_resume_score || cand.resume_intelligence_reports?.ats_resume_score || 'N/A'}"

content = content.replace(old_ats_render, new_ats_render)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed Candidate Pool ATS Intel")
