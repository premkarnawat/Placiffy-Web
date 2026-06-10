# -*- coding: utf-8 -*-
with open(r"app\candidate\trust-score\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will calculate the real-time score based on database state
# Email (auth user) = 20 pts
# Profile = up to 40 pts (pct * 0.4)
# Mobile Number linked = 20 pts
# Aadhar (mock pending) = 0 pts currently
logic_patch = """
  const calculateTrustScore = (candidateData: any) => {
    if (!candidateData) return 0;
    
    let score = 0;
    
    // 1. Identity / Email Verified (always true if logged in)
    score += 20;
    
    // 2. Profile Completion
    const pct = candidateData.profile_completion_pct || 0;
    score += Math.floor(pct * 0.4); // max 40 points
    
    // 3. Mobile Number Linked
    const hasMobile = !!candidateData.candidate_profiles?.[0]?.mobile_number;
    if (hasMobile) score += 20;

    // 4. Aadhar / Gov ID (Pending for now)
    // score += 20;
    
    return score;
  };

  useEffect(() => {
    if (cand) {
      const realScore = calculateTrustScore(cand);
      // Persist the real calculated score back to the database so it's global
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

content = re.sub(r'  if \(loading\) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;\n\n  const score = cand\?\.trust_score \|\| 0;', logic_patch, content, flags=re.DOTALL)


# Update the UI strings to reflect the dynamic logic
ui_patch_mobile = """          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className={`${hasMobile ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'} p-3 rounded-full`}><CheckCircle2 size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Mobile Number Verification</h3>
              <p className="text-sm text-gray-500 mt-1">{hasMobile ? 'Your mobile number is linked and verified.' : 'Please link your mobile number in the Profile page.'}</p>
              <div className={`mt-3 flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full w-fit ${hasMobile ? 'text-purple-600 bg-purple-50' : 'text-gray-500 bg-gray-50'}`}>
                {hasMobile ? '+20 Points' : '0 / 20 Points'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 border-dashed shadow-sm flex items-start gap-4 opacity-75">"""

content = re.sub(r'          <div className="bg-white rounded-2xl p-6 border border-gray-200 border-dashed shadow-sm flex items-start gap-4 opacity-75">', ui_patch_mobile, content, flags=re.DOTALL)

# Ensure profile points are dynamic
content = content.replace("+{Math.floor((cand?.profile_completion_pct || 0) * 0.4)} Points", "+{profilePoints} Points")

with open(r"app\candidate\trust-score\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected real-time Trust Score calculation logic!")
