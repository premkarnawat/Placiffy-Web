path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\(portal)\candidate\verification\page.tsx"
import os
if not os.path.exists(path):
    path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx"

with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()
    start = content.find("const handleSubmit")
    end = content.find("toast", start + 200)
    print(content[start:end+100])
