import requests

url = "https://placify-backend-dzj7.onrender.com/api/resume/parse-public"
payload = {
    "url": "https://raw.githubusercontent.com/resume/resume.github.com/master/resume.json" # Just dummy url
}
# Wait, it might expect a file or a Supabase storage path.
