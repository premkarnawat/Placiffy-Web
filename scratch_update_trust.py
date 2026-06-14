with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\trust-score\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_calc = """  const calculateTrustScore = (candidateData: any) => {
    if (!candidateData) return 0;
    let score = 20; // Base email points
    const pct = candidateData.profile_completion_pct || 0;
    score += Math.floor(pct * 0.4);
    const hasMobile = !!candidateData.candidate_profiles?.[0]?.mobile_number;
    if (hasMobile) score += 20;
    return score;
  };"""

new_calc = """  const calculateTrustScore = (candidateData: any) => {
    if (!candidateData) return 0;
    if (candidateData.trust_score) return candidateData.trust_score; // use DB value
    
    let score = 20; // Base email points
    const pct = candidateData.profile_completion_pct || 0;
    score += Math.floor(pct * 0.4);
    const hasMobile = !!candidateData.candidate_profiles?.[0]?.mobile_number;
    if (hasMobile) score += 20;
    return score;
  };"""

content = content.replace(old_calc, new_calc)

old_ui = """  const score = calculateTrustScore(cand);
  const profilePoints = Math.floor((cand?.profile_completion_pct || 0) * 0.4);
  const hasMobile = !!cand?.candidate_profiles?.[0]?.mobile_number;"""

new_ui = """  const score = calculateTrustScore(cand);
  const breakdown = cand?.trust_score_breakdown || {};
  const profilePoints = breakdown.profile_points || Math.floor((cand?.profile_completion_pct || 0) * 0.4);
  const hasMobile = cand?.candidate_profiles?.[0]?.mobile_number || breakdown.mobile_verified;
  const identityPoints = breakdown.identity_points || 20;"""

content = content.replace(old_ui, new_ui)

content = content.replace("+20 Points", "+{identityPoints} Points")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\trust-score\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated trust score page")
