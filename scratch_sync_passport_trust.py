# -*- coding: utf-8 -*-
with open(r"app\candidate\passport\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Inject the dynamic calculateTrustScore function into the passport page so it calculates the score real-time if the database is lagging
new_fetch_logic = """
  const calculateTrustScore = (candidateData: any) => {
    if (!candidateData) return 0;
    let score = 20; // Base email points
    const pct = candidateData.profile_completion_pct || 0;
    score += Math.floor(pct * 0.4);
    const hasMobile = !!candidateData.candidate_profiles?.[0]?.mobile_number;
    if (hasMobile) score += 20;
    return score;
  };

  const fetchPassport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();
      
      if (cand) {
        const realTrustScore = calculateTrustScore(cand);

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
          trust_score: realTrustScore,
          ats_score: cand.profile_completion_pct || 0,
          profile_photo_url: cand.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          skills: parsedSkills, // Will fall back to empty array in UI if null
          experience_years: cand.experience_years || 0,
          summary: cand.summary || "No professional summary provided.",
          location: cand.location || profile.city || 'Remote',
          current_job_role: profile.current_job_role || 'Seeking Opportunities'
        });
        
        // Silently sync the calculated score back to db
        if (cand.trust_score !== realTrustScore) {
          supabase.from('candidates').update({ trust_score: realTrustScore }).eq('id', cand.id).then();
        }
      }
"""

# We replace everything from fetchPassport = async () => { down to setData(...) { ... });
content = re.sub(r'  const fetchPassport = async \(\) => \{.*?\n        \}\);\n      \}', new_fetch_logic, content, flags=re.DOTALL)

with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected real-time Trust Score Calculator directly into the Passport page!")
