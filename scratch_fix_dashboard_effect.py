# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_use_effect = """  useEffect(() => {
    if (!user) return;
    fetchStats();

    const channel = supabase.channel('dashboard_metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => {
        fetchStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pipeline_candidates' }, () => {
        fetchStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

"""

# Replace everything from `useEffect(() => {` up to (but not including) `  const fetchStats`
content = re.sub(r'  useEffect\(\(\) => \{.*?  const fetchStats = async', proper_use_effect + '  const fetchStats = async', content, flags=re.DOTALL)

# Since I just fixed the useEffect, I also need to make sure the END of the file has the correct closing tags.
# Let's count tags again.

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed useEffect!")
