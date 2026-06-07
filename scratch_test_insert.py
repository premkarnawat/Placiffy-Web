import requests
import uuid

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/users"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

user_data = {
    "id": str(uuid.uuid4()),
    "email": "test2@example.com",
    "password_hash": "dummyhash",
    "role": "candidate",
    "name": "Test User"
}

try:
    resp = requests.post(url, headers=headers, json=user_data)
    print("Status:", resp.status_code)
    print("Response:", resp.text)
except Exception as e:
    print(f"Error: {e}")
