with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    
idx = content.find("ats_resume_score")
print(content[idx-200:idx+200] if idx != -1 else "Not found")
