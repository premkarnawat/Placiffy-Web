import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "href: '/company/verification'" not in content:
        # Add to navigation array
        target = "{ name: 'Settings', href: '/company/settings', icon: Settings },"
        replacement = "{ name: 'Verification', href: '/company/verification', icon: Shield },\n  " + target
        
        content = content.replace(target, replacement)
        
        # Ensure Shield is imported
        if "Shield," not in content and "Shield " not in content:
            content = content.replace("LayoutDashboard,", "LayoutDashboard, Shield,")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated company layout with Verification route")
    else:
        print("Route already exists")
else:
    print("File not found")
