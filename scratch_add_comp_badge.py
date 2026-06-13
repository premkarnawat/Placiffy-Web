import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\settings\page.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if verification_badge is already fetched
    if "verification_badge" not in content:
        # Add to the select query
        content = content.replace("select('*')", "select('*, verification_badge')")
        
        # Edit Profile Title addition
        target = '<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">'
        replacement = '<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">\n          {company?.verification_badge && <span className="text-emerald-500 bg-emerald-50 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200"><ShieldCheck size={16}/> Verified Employer</span>}'
        
        content = content.replace(target, replacement)
        
        # Ensure ShieldCheck is imported
        if "ShieldCheck" not in content:
            content = content.replace("import { Loader2,", "import { Loader2, ShieldCheck,")
            if "ShieldCheck" not in content: # Fallback if first replacement didn't work
                content = content.replace("import { Settings as SettingsIcon", "import { Settings as SettingsIcon, ShieldCheck")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated company settings profile with Verification Badge")
    else:
        print("Badge already present")
else:
    print("File not found")
