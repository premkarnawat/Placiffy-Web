import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/candidates"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}
payload = {
    "user_id": "00000000-0000-0000-0000-000000000000",
    "headline": "Dev",
    "summary": "Summary",
    "location": "US",
    "current_company": "Comp",
    "current_role": "Dev",
    "skills": ["JS"],
    "experience_years": 5,
    "resume_url": "url",
    "profile_photo_url": "url"
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())
