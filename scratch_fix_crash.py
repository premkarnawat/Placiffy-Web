# -*- coding: utf-8 -*-
with open(r"app\candidate\trust-score\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Safely inject the missing definitions
missing_logic = """
  const calculateTrustScore = (candidateData: any) => {
    if (!candidateData) return 0;
    let score = 20; // Base email points
    const pct = candidateData.profile_completion_pct || 0;
    score += Math.floor(pct * 0.4);
    const hasMobile = !!candidateData.candidate_profiles?.[0]?.mobile_number;
    if (hasMobile) score += 20;
    return score;
  };

  useEffect(() => {
    if (cand) {
      const realScore = calculateTrustScore(cand);
      if (cand.trust_score !== realScore) {
        supabase.from('candidates').update({ trust_score: realScore }).eq('id', cand.id).then();
      }
    }
  }, [cand]);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  const score = calculateTrustScore(cand);
  const profilePoints = Math.floor((cand?.profile_completion_pct || 0) * 0.4);
  const hasMobile = !!cand?.candidate_profiles?.[0]?.mobile_number;
"""

content = re.sub(r'  if \(loading\).*?\n\n  const score = cand\?\.trust_score \|\| 0;', missing_logic, content, flags=re.DOTALL)

with open(r"app\candidate\trust-score\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected the missing logic that caused the React crash!")
