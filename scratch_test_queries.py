import requests

HEADERS = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54"
}

def test_q(name, q):
    url = f"https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/{q}"
    res = requests.get(url, headers=HEADERS)
    print(f"[{name}] {res.status_code}")
    if res.status_code != 200:
        print(f"   -> {res.text}")

# Workspace: supabase.from('applications').select('id, job_id, status, jobs!inner(company_id)')
test_q("Workspace Apps", "applications?select=id,job_id,status,jobs!inner(company_id)&limit=1")

# Dashboard Messages: supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('read', false)
test_q("Dashboard Msgs", "messages?select=id&receiver_id=eq.1&read=eq.false&limit=1")

# Dashboard Candidates: supabase.from('candidates').select('*', { count: 'exact', head: true })
test_q("Dashboard Cands", "candidates?select=id&limit=1")

# Candidates: select(*, candidate_profiles(experience, skills), passports(trust_score, verification_status), resume_intelligence_reports(ats_resume_score))
test_q("Candidates Pool", "candidates?select=*,candidate_profiles(experience,skills)&limit=1")

# Applicants: select('*, candidates!inner(*, candidate_profiles(experience), passports(trust_score), resume_intelligence_reports(ats_resume_score))')
test_q("Applicants", "applications?select=*,candidates!inner(*,candidate_profiles(experience))&limit=1")

