with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_fetch = """      const [candCount, compCount, jobCount, appCount, msgCount] = await Promise.all([
        supabase.from('candidates').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true })
      ]);

      setMetrics({
        candidates: candCount.count || 0,
        activeCandidates: Math.floor((candCount.count || 0) * 0.4), // Simulated active based on real count
        companies: compCount.count || 0,
        jobs: jobCount.count || 0,
        applications: appCount.count || 0,
        messages: msgCount.count || 0,
        passports: 0,
      });"""

new_fetch = """      const [candCount, compCount, jobCount, appCount, msgCount, passCount, verifCount, activeCandCount] = await Promise.all([
        supabase.from('candidates').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('passports').select('*', { count: 'exact', head: true }),
        supabase.from('candidate_verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('candidates').select('*', { count: 'exact', head: true }).gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      setMetrics({
        candidates: candCount.count || 0,
        activeCandidates: activeCandCount.count || 0,
        companies: compCount.count || 0,
        jobs: jobCount.count || 0,
        applications: appCount.count || 0,
        messages: msgCount.count || 0,
        passports: passCount.count || 0,
        verificationsPending: verifCount.count || 0,
      });"""

content = content.replace(old_fetch, new_fetch)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated admin dashboard")
