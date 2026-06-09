# -*- coding: utf-8 -*-
import re

with open(r"app\candidate\passport\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

patch_fetch = """  const fetchData = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      const { data: passport } = await supabase.from('passports').select('*').eq('candidate_id', cand?.id).single();
      
      setData({ 
        ...cand, 
        name: user?.user_metadata?.full_name || 'Candidate', 
        email: user?.email,
        passport_data: passport 
      });
    } catch (e) {
      console.error(e);
      toast('error', 'Error fetching Passport', 'Could not load your passport data.');
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r'  const fetchData = async \(\) => \{.*?  \};', patch_fetch, content, flags=re.DOTALL)

with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched Candidate Passport page to use native Auth metadata and passports table!")
