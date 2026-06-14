with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace("CheckCircle2, XCircle, Award", "CheckCircle2, XCircle, Award, Loader2")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Added Loader2 import")
