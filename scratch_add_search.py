with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Replace the lucide-react import
old_import = "Settings, LogOut, Loader2, Sparkles, Shield, HelpCircle, Bell"
new_import = "Settings, LogOut, Loader2, Sparkles, Shield, HelpCircle, Bell, Search"

new_content = content.replace(old_import, new_import)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "w", encoding="utf-8-sig") as f:
    f.write(new_content)
    
print("Added Search to lucide-react imports")
