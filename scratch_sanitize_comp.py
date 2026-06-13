import os

files = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\[id]\page.tsx"
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove the users join
        content = content.replace("*, users(email, name, phone)", "*")
        
        # Remove UI mappings that use users
        content = content.replace("{c.users?.name || 'Admin User'}", "Enterprise Contact")
        content = content.replace("{c.users?.email}", "No Email Linked")
        content = content.replace("{c.users?.phone}", "")
        
        content = content.replace("{company.users?.name || 'Admin User'}", "Enterprise Contact")
        content = content.replace("{company.users?.email}", "No Email Linked")
        content = content.replace("{company.users?.phone}", "")
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Sanitized: {filepath}")
    else:
        print(f"File not found: {filepath}")
