import requests

# A tiny valid PDF
minimal_pdf = b'%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Resources<<>>/Contents 4 0 R>>endobj 4 0 obj<</Length 21>>stream\nBT /F1 12 Tf (Hello) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\n0000000185 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n256\n%%EOF\n'

url = "https://placify-backend-dzj7.onrender.com/api/resume/parse-public"
files = {'file': ('test.pdf', minimal_pdf, 'application/pdf')}

try:
    resp = requests.post(url, files=files, timeout=30)
    print("Status:", resp.status_code)
    print("Response:", resp.text)
except Exception as e:
    print(f"Error: {e}")
