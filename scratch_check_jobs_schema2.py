import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/jobs?limit=1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjIzMzIyfQ.L6uY9-Yy-Ue3ZgBf95gYQpGg3eT83H-484VpA4L_L0M",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjIzMzIyfQ.L6uY9-Yy-Ue3ZgBf95gYQpGg3eT83H-484VpA4L_L0M"
}
response = requests.get(url, headers=headers)
data = response.json()
if data:
    print(list(data[0].keys()))
else:
    print("Jobs table is completely empty.")
