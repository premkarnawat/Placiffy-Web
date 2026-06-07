import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/users?limit=1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NjMyMiwiZXhwIjoyMDk2MjMyMzIyfQ.cvppyUW9IfSHZbAI728-bit8jKEcHsttov2ciACrHfA",
}

try:
    resp = requests.options(url, headers=headers)
    print("OPTIONS headers:")
    for k, v in resp.headers.items():
        if "method" in k.lower() or "allow" in k.lower() or "type" in k.lower():
            print(f"{k}: {v}")
            
    # To get schema, we can try requesting a non-existent column and read the error hint!
    resp = requests.get("https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/users?select=nonexistent", headers=headers)
    print("Schema hint:", resp.text)
except Exception as e:
    print(f"Error: {e}")
