with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_fetch = """      const { data, error } = await supabase.from('candidates').select('*, verification_badge').order('created_at', { ascending: false });
      if (error) throw error;

      const enriched = await Promise.all((data || []).map(async (c) => {
        const [appRes, verRes] = await Promise.all([
          supabase.from('applications').select('id', { count: 'exact' }).eq('candidate_id', c.id),
          supabase.from('verifications').select('status').eq('user_id', c.user_id).maybeSingle()
        ]);
        return {
          ...c,
          total_apps: appRes.count || 0,
          verification_status: verRes.data?.status || 'unverified'
        };
      }));
      setCandidates(enriched);"""

new_fetch = """      const { data, error } = await supabase.from('candidates').select('*, verification_badge').order('created_at', { ascending: false });
      if (error) throw error;

      const [appsRes, verifRes] = await Promise.all([
         supabase.from('applications').select('candidate_id'),
         supabase.from('candidate_verifications').select('candidate_id, status')
      ]);

      const appCounts = (appsRes.data || []).reduce((acc: any, app: any) => {
          acc[app.candidate_id] = (acc[app.candidate_id] || 0) + 1;
          return acc;
      }, {});

      const verifStatus = (verifRes.data || []).reduce((acc: any, v: any) => {
          acc[v.candidate_id] = v.status;
          return acc;
      }, {});

      const enriched = (data || []).map(c => ({
          ...c,
          total_apps: appCounts[c.id] || 0,
          verification_status: verifStatus[c.id] || 'unverified'
      }));

      setCandidates(enriched);"""

content = content.replace(old_fetch, new_fetch)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated admin candidates fetch logic")
