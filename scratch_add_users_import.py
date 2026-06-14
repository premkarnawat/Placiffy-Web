with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace("Mail, MapPin, Briefcase", "Mail, MapPin, Briefcase, Users")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Added Users import to applicants page")
