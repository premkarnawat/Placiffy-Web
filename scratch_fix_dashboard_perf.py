# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

old_fetch = r"const { count: jobsCount } = await supabase\.from\('jobs'\).*?offers: offerCount \|\| 0\n      }\);"

new_fetch = """const [
        { count: jobsCount },
        { count: appCount },
        { count: interviewCount },
        { count: offerCount }
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'active'),
        supabase.from('pipeline_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
        supabase.from('pipeline_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('pipeline_status', 'interview'),
        supabase.from('pipeline_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('pipeline_status', 'offer')
      ]);

      setStats({
        activeJobs: jobsCount || 0,
        applicants: appCount || 0,
        verified: appCount ? Math.floor(appCount * 0.7) : 0,
        interviews: interviewCount || 0,
        offers: offerCount || 0
      });"""

if re.search(old_fetch, content, re.DOTALL):
    content = re.sub(old_fetch, new_fetch, content, flags=re.DOTALL)
    with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Optimized dashboard fetchStats")
else:
    print("Could not find fetchStats")
