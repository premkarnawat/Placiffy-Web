import os

files = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove the users join
        content = content.replace("*, users!user_id(email)", "*")
        
        # Remove UI mappings that use c.users.email
        content = content.replace("{c.users?.email}", "No Email Linked")
        content = content.replace("{cand.users?.email}", "No Email Linked")
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Sanitized: {filepath}")
    else:
        print(f"File not found: {filepath}")
