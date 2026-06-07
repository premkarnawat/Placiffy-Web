import requests

url = "https://placify-backend-dzj7.onrender.com/api/resume/parse-public"
headers = {
    "Origin": "https://ruby-galaxy.vercel.app",
    "Access-Control-Request-Method": "POST"
}
try:
    resp = requests.options(url, headers=headers)
    print("OPTIONS status:", resp.status_code)
    print("CORS headers:", resp.headers.get("Access-Control-Allow-Origin"))
except Exception as e:
    print(f"Error: {e}")
