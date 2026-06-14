with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_logic = """      // 2. Update core table badge if approved
      if (action === 'approved') {
        await supabase.from(coreTable).update({
          verification_badge: true
        }).eq('id', coreId);
      }"""

new_logic = """      // 2. Update core table badge if approved
      if (action === 'approved') {
        if (coreTable === 'candidates') {
           const { data: cand } = await supabase.from('candidates').select('trust_score_breakdown, trust_score').eq('id', coreId).single();
           const breakdown = cand?.trust_score_breakdown || {};
           breakdown.identity_verified = true;
           breakdown.identity_points = 50; // Max identity points for aadhar/pan
           
           await supabase.from('candidates').update({
             verification_badge: true,
             trust_score_breakdown: breakdown,
             trust_score: (cand?.trust_score || 0) + 50
           }).eq('id', coreId);
        } else {
           await supabase.from(coreTable).update({
             verification_badge: true
           }).eq('id', coreId);
        }
      }"""

content = content.replace(old_logic, new_logic)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated admin verifications logic")
