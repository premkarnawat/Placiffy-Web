# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_fetch_stats = """  const fetchStats = async () => {
    try {
      const { data: company } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!company) return;

      const [
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
      });
    } catch (e) {
      console.error(e);
    }
  };

  return ("""

content = re.sub(r'  const fetchStats = async \(\) => \{.*?  return \(', proper_fetch_stats, content, flags=re.DOTALL)

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed fetchStats!")
