# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Remove the dummy SOURCES array and funnel rendering since it's mock
content = re.sub(r'const SOURCES = \[.*?\];', '', content, flags=re.DOTALL)

# 2. Fix Realtime channels to point to applications instead of pipeline_candidates
patch_realtime = """    const channel = supabase.channel('dashboard_metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchStats())
      .subscribe();"""
content = re.sub(r'    const channel = supabase\.channel\(\'dashboard_metrics\'\).*?\.subscribe\(\);', patch_realtime, content, flags=re.DOTALL)

# 3. Fix fetchStats queries to use applications instead of pipeline_candidates
patch_fetch = """  const fetchStats = async () => {
    try {
      const { data: company } = await supabase.from('companies').select('id, name').eq('user_id', user?.id).single();
      if (!company) return;

      const [
        { count: jobsCount },
        { count: appCount },
        { count: interviewCount },
        { count: offerCount }
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'active'),
        supabase.from('applications').select('*, jobs!inner(company_id)', { count: 'exact', head: true }).eq('jobs.company_id', company.id),
        supabase.from('applications').select('*, jobs!inner(company_id)', { count: 'exact', head: true }).eq('jobs.company_id', company.id).eq('status', 'interview'),
        supabase.from('applications').select('*, jobs!inner(company_id)', { count: 'exact', head: true }).eq('jobs.company_id', company.id).eq('status', 'offered')
      ]);

      setStats({
        activeJobs: jobsCount || 0,
        applicants: appCount || 0,
        verified: 0, // Real verification tracking will be built in Phase 4
        interviews: interviewCount || 0,
        offers: offerCount || 0
      });
    } catch (e) {
      console.error(e);
    }
  };"""
content = re.sub(r'  const fetchStats = async \(\) => \{.*?  \};', patch_fetch, content, flags=re.DOTALL)

# 4. Fix hardcoded name "Alex"
content = content.replace('Welcome Back, Alex.', 'Welcome Back.')

# 5. Remove sources UI rendering if it exists in the JSX
content = re.sub(r'\{/\* Sourcing Channels \*/\}.*?\{/\* Recent Activity \*/\}', '{/* Recent Activity */}', content, flags=re.DOTALL)

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched Company Dashboard to strictly use real DB aggregations and remove mock data!")
