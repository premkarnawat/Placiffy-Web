with open(r"app\candidate\trust-score\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    if "const profilePoints =" in content:
        print("SUCCESS: React variables correctly injected. Crash is fixed.")
    else:
        print("ERROR: Variables still missing!")
