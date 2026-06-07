import requests

url = "https://placify-backend-dzj7.onrender.com/health"
try:
    resp = requests.get(url)
    print("Health:", resp.status_code, resp.text)
except Exception as e:
    print(f"Error: {e}")
