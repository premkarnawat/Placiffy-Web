with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_setData = """      setData({
        cand: candRes.data,
        appCount: appCountRes.count || 0,"""

new_setData = """      let passportData = null;
      if (candRes.data?.id) {
          const passRes = await supabase.from('passports').select('*').eq('candidate_id', candRes.data.id).single();
          passportData = passRes.data;
      }

      setData({
        cand: candRes.data,
        passport: passportData,
        appCount: appCountRes.count || 0,"""

content = content.replace(old_setData, new_setData)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated Candidate Dashboard passport fetch")
