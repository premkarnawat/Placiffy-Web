with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    
# check if it uses verification_status
print("verification_status:", "verification_status" in content)
print("activity_score:", "activity_score" in content)
print("education_summary:", "education_summary" in content)
print("project_summary:", "project_summary" in content)
