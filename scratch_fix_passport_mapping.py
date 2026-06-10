# -*- coding: utf-8 -*-
with open(r"app\candidate\passport\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

new_mapping = """
        // Map real db data to PassportShowcase prop
        const profile = cand.candidate_profiles?.[0] || {};
        
        // Parse skills robustly since they might be stored as a postgres array string "['Python', 'C++']"
        let parsedSkills = [];
        try {
          if (typeof cand.skills === 'string') {
            parsedSkills = JSON.parse(cand.skills.replace(/'/g, '"'));
          } else if (Array.isArray(cand.skills)) {
            parsedSkills = cand.skills;
          }
        } catch(e) {}
        
        if (parsedSkills.length === 0) parsedSkills = null;

        setData({
          candidate_id: cand.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate',
          role: cand.headline || profile.current_job_role || 'Professional',
          trust_score: cand.trust_score || 0,
          ats_score: cand.profile_completion_pct || 0,
          profile_photo_url: cand.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          skills: parsedSkills, // Will fall back to empty array in UI if null
          experience_years: cand.experience_years || 0,
          summary: cand.summary || "No professional summary provided.",
          location: cand.location || profile.city || 'Remote',
          current_job_role: profile.current_job_role || 'Seeking Opportunities'
        });
"""

content = re.sub(r'        // Map real db data to PassportShowcase prop.*?\n        \}\);', new_mapping, content, flags=re.DOTALL)

with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Passport data mapping to pull directly from the candidates table!")
