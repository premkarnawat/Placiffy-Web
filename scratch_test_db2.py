import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/candidates?select=id"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
}

resp = requests.get(url, headers=headers)
print("Candidates:", resp.status_code, resp.text)

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/companies?select=id"
resp = requests.get(url, headers=headers)
print("Companies:", resp.status_code, resp.text)
