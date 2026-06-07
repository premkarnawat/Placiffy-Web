import requests
import json

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
}

try:
    resp = requests.get(url, headers=headers)
    data = resp.json()
    users_def = data.get('definitions', {}).get('users', {})
    print("Users table columns:")
    for prop in users_def.get('properties', {}):
        print(f"- {prop}")
except Exception as e:
    print(f"Error: {e}")
