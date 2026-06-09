import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54"
}
response = requests.get(url, headers=headers)
schema = response.json()
if 'definitions' in schema and 'companies' in schema['definitions']:
    print(list(schema['definitions']['companies']['properties'].keys()))
else:
    print("Could not find schema")
