path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "supabase.from('applications').select('*, jobs(job_title, companies(name))')",
    "supabase.from('applications').select('*, jobs(title, companies(name))')"
)

content = content.replace(
    "supabase.from('verifications').select('*').eq('user_id',",
    "supabase.from('candidate_verifications').select('*').eq('candidate_id',"
)

content = content.replace(
    "(await supabase.from('candidates').select('user_id').eq('id', params.id).single()).data?.user_id",
    "params.id"
)

with open(path, "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated Candidate Profile successfully.")
