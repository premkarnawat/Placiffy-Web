with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    
# Find the chat input area
idx = content.find("<div className=\"p-4 bg-white border-t border-gray-100\">")
if idx == -1:
    idx = content.find("placeholder=\"Type your message...")
    
print(content[idx-200:idx+800] if idx != -1 else "Input area not found")
