import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54"
response = requests.get(url)
schema = response.json()
if 'components' in schema and 'schemas' in schema['components']:
    for k, v in schema['components']['schemas'].items():
        if 'companies' in k.lower() or 'candidates' in k.lower():
            print(f"Table: {k}")
            print(list(v['properties'].keys()))
            print(v['properties'])
