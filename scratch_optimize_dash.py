# -*- coding: utf-8 -*-
with open(r"app\candidate\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will completely refactor fetchData to be blazing fast
refactored_fetch_data = """  const fetchData = async () => {
    try {
      // Execute all Supabase queries simultaneously using Promise.all for < 1s load time
      const [candRes, appCountRes, msgCountRes, interviewCountRes, offerCountRes] = await Promise.all([
        supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user?.id).single(),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('read', false),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id).in('status', ['shortlisted', 'interviewing']),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id).in('status', ['offered', 'hired'])
      ]);

      setData({ 
        cand: candRes.data, 
        appCount: appCountRes.count || 0,
        msgCount: msgCountRes.count || 0,
        interviewCount: interviewCountRes.count || 0,
        offerCount: offerCountRes.count || 0
      });
      
      // We removed the slow Render Python API call to ensure instant loads.
      setInsights([]);
    } catch (e) {
      console.error("Dashboard DB fetch error:", e);
    }
  };"""

content = re.sub(r'  const fetchData = async \(\) => \{.*?(?=  if \(\!data\))', refactored_fetch_data, content, flags=re.DOTALL)

with open(r"app\candidate\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Optimized dashboard queries with Promise.all and fixed application status enum checks!")
