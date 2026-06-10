import urllib.request
import json

api_key = "AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    with urllib.request.urlopen(url) as response:
        res = json.loads(response.read())
        for model in res.get("models", []):
            if "embedContent" in model.get("supportedGenerationMethods", []):
                print(model["name"])
except urllib.error.HTTPError as e:
    print(f"FAILED: {e.code} - {e.read().decode('utf-8')}")
