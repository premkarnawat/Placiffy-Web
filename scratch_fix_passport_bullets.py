with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(" ", "- ")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed bullets")
