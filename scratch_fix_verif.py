import os
import re

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = """      if (newStatus === 'approved' && type === 'candidate' && entityId) {
         // Auto score and check passport
         await calculateCandidateScores(entityId);
      }"""

replacement = """      if (newStatus === 'approved' && type === 'candidate' && entityId) {
         // Auto score and cascade into passport creation
         const result = await calculateCandidateScores(entityId);
         if (result && result.trustScore >= 80) {
             const { data: existingPass } = await supabase.from('passports').select('id').eq('candidate_id', entityId).maybeSingle();
             if (!existingPass) {
                 await supabase.from('passports').insert({
                     candidate_id: entityId,
                     verification_status: 'active',
                     trust_score: result.trustScore
                 });
             } else {
                 await supabase.from('passports').update({ trust_score: result.trustScore, verification_status: 'active' }).eq('id', existingPass.id);
             }
         }
      }"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Target not found. Will rewrite file.")
