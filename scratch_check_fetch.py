with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    
idx = content.find("const fetchConversations")
print(content[idx:idx+1500])
