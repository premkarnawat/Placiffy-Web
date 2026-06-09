import requests

url = "https://wkgczwtnxrseiykcrzqj.supabase.co/auth/v1/signup"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54",
    "Content-Type": "application/json"
}
payload = {
    "email": "testsignup_confirm@test.com",
    "password": "SecurePassword123!"
}
response = requests.post(url, headers=headers, json=payload)
data = response.json()
print("Session is NULL?" , data.get("session") is None)
print(data)
