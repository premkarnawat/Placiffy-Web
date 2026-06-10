# -*- coding: utf-8 -*-
with open(r"app\candidate\passport\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

new_fetch_logic = """
        // Map real db data to PassportShowcase prop
        const profile = cand.candidate_profiles?.[0] || {};
        setData({
          candidate_id: cand.id,
          name: profile.fullName || user.email?.split('@')[0] || 'Candidate',
          role: profile.headline || profile.current_job_role || 'Professional',
          trust_score: cand.trust_score || 0,
          ats_score: cand.profile_completion_pct || 0,
          profile_photo_url: profile.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          skills: profile.skills || ['JavaScript', 'React', 'Node.js'],
          experience_years: profile.experience_years || 0,
          summary: profile.summary || "Highly motivated professional ready to contribute to innovative teams.",
          location: profile.city ? `${profile.city}, ${profile.state || ''}` : 'Remote',
          current_job_role: profile.current_job_role || 'Seeking Opportunities'
        });
"""

content = re.sub(r'        // Map real db data to PassportShowcase prop.*?\n        \}\);', new_fetch_logic, content, flags=re.DOTALL)

with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated /candidate/passport/page.tsx data fetcher!")
