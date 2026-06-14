with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    print([line for line in content.split('\n') if 'href' in line])
