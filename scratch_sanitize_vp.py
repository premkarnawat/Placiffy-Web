import os

files = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\passports\page.tsx"
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove the users join
        content = content.replace("*, users(email, role)", "*")
        content = content.replace("*, candidates(full_name, location, users(email))", "*, candidates(full_name, location)")
        
        # Remove UI mappings
        content = content.replace("{v.users?.email}", "No Email Linked")
        content = content.replace("{p.candidates?.users?.email}", "No Email Linked")
        
        # Also remove users email check in search filter
        content = content.replace("|| (v.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase())", "")
        content = content.replace("|| (p.candidates?.users?.email || '').toLowerCase().includes(s)", "")
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Sanitized: {filepath}")
    else:
        print(f"File not found: {filepath}")
