import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/jobs"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}
payload = {
    "company_id": "00000000-0000-0000-0000-000000000000",
    "title": "Title",
    "department": "Dept",
    "description": "Desc",
    "required_skills": ["JS"],
    "preferred_skills": ["TS"],
    "experience": "3-5",
    "education": "Bachelors",
    "location": "US",
    "work_model": "Remote",
    "salary_range": "100k",
    "employment_type": "Full-time",
    "notice_period": "30",
    "priority": "High",
    "open_positions": 1,
    "deadline": "2024-01-01"
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())
