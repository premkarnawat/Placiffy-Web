import requests

url = "https://placify-backend-dzj7.onrender.com/api/auth/register"
payload = {
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "candidate"
}

try:
    resp = requests.post(url, json=payload, timeout=10)
    print("Status:", resp.status_code)
    print("Response:", resp.text)
except Exception as e:
    print(f"Error: {e}")
