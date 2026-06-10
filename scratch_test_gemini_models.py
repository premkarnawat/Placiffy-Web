import urllib.request
import json
import os

api_key = "AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ"
models_to_test = ["text-embedding-004", "embedding-001"]

for model in models_to_test:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent?key={api_key}"
    data = json.dumps({
        "model": f"models/{model}",
        "content": {"parts": [{"text": "Hello world"}]}
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read())
            print(f"SUCCESS with {model}!")
            if "embedding" in res and "values" in res["embedding"]:
                print(f"Dimensions: {len(res['embedding']['values'])}")
    except urllib.error.HTTPError as e:
        print(f"FAILED with {model}: {e.code} - {e.read().decode('utf-8')}")
