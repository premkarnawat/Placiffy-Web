path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()
    start = content.find("const fetchData = async () => {")
    end = content.find("};", start)
    print(content[start:end+2])
