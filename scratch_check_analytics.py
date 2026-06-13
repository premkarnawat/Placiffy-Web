with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\analytics\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    if "users" in content or "jobs(" in content:
        print("Found potentially problematic join in analytics")
    else:
        print("Analytics is clean.")
