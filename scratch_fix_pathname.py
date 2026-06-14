with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Let's replace `pathname === item.href || (pathname.startsWith(item.href)`
# with `pathname === item.href || (pathname?.startsWith(item.href)`
new_content = content.replace("pathname.startsWith(item.href)", "pathname?.startsWith(item.href)")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "w", encoding="utf-8-sig") as f:
    f.write(new_content)
    
print("Fixed pathname issue in layout.tsx")
