with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Let's find where "ATS Intel" is rendered
idx = content.find("ATS Intel")
print(content[idx-200:idx+200] if idx != -1 else "Not found")
