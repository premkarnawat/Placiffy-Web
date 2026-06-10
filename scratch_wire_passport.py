# -*- coding: utf-8 -*-
with open(r"app\candidate\passport\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add the fetch for intelligence report
new_fetch_logic = """
      const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();
      
      if (cand) {
        const { data: intel } = await supabase.from('resume_intelligence_reports').select('overall_score, grade').eq('candidate_id', cand.id).single();
"""

content = content.replace("const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();\n      \n      if (cand) {", new_fetch_logic)

new_data_props = """          role: cand.headline || profile.current_job_role || 'Professional',
          trust_score: realTrustScore,
          ats_score: cand.profile_completion_pct || 0,
          resume_intelligence_score: intel?.overall_score || null,
          resume_intelligence_grade: intel?.grade || null,
"""

content = content.replace("role: cand.headline || profile.current_job_role || 'Professional',\n          trust_score: realTrustScore,\n          ats_score: cand.profile_completion_pct || 0,", new_data_props)

with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Wired the Passport Page to fetch live Resume Intelligence data from Supabase!")
