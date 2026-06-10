import urllib.request
import json

api_key = "AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for model in data.get("models", []):
            if "gemini" in model.get("name", ""):
                print(model.get("name"), "-", model.get("supportedGenerationMethods", []))
except Exception as e:
    print("Error:", e)
