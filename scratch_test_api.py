import requests

url = "https://placify-backend-dzj7.onrender.com/api/resume/parse-public"
files = {'file': ('dummy.pdf', b'dummy content', 'application/pdf')}

try:
    resp = requests.post(url, files=files)
    print(resp.status_code)
    print(resp.text)
except Exception as e:
    print(f"Error: {e}")
