import asyncio
from supabase import create_client

url = "https://wkgczwtnxrseiykcrzqj.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54"
supabase = create_client(url, key)

try:
    cands = supabase.table("candidates").select("*").limit(1).execute()
    if cands.data:
        print("Candidates columns:", list(cands.data[0].keys()))
        
    profiles = supabase.table("candidate_profiles").select("*").limit(1).execute()
    if profiles.data:
        print("Candidate profiles columns:", list(profiles.data[0].keys()))
except Exception as e:
    print(f"Error: {e}")
