# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
old_effect = r'  useEffect\(\(\) \=\> \{\n    if \(user\) fetchStats\(\);\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  \}, \[user\]\);'

new_effect = """  useEffect(() => {
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
  }, [user]);"""

if re.search(old_effect, content):
    content = re.sub(old_effect, new_effect, content)
    with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Supabase realtime to dashboard")
else:
    print("Could not find old effect")
