import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/storage/v1/bucket"

headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
    "Content-Type": "application/json"
}

data = {
    "id": "resumes",
    "name": "resumes",
    "public": True
}

resp = requests.post(url, headers=headers, json=data)
print(resp.status_code, resp.text)
