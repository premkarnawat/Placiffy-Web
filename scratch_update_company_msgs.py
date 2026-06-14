with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_fetch = """      const { data: shorts } = await supabase.from('candidate_shortlists').select('candidate_id, status').eq('company_id', cu.id);
      if (shorts) {
          const cIds = shorts.map((s: any) => s.candidate_id);
          const { data: cands } = await supabase.from('candidates').select('id, user_id, full_name, headline').in('id', cIds);
          setConversations(cands || []);
      }"""

new_fetch = """      const { data: apps } = await supabase.from('applications').select('candidate_id, jobs!inner(company_id)').eq('jobs.company_id', cu.id);
      if (apps) {
          const cIds = [...new Set(apps.map((s: any) => s.candidate_id))];
          if (cIds.length > 0) {
              const { data: cands } = await supabase.from('candidates').select('id, user_id, full_name, headline, profile_photo_url').in('id', cIds);
              setConversations(cands || []);
          }
      }"""

content = content.replace(old_fetch, new_fetch)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated company messages mapping")
