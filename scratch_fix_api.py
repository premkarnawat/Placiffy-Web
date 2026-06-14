with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\candidate\resume-intelligence\route.ts", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(".join('\n')}", ".join('\\n')}")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\candidate\resume-intelligence\route.ts", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Fixed API route syntax")
