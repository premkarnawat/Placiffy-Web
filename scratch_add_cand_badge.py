import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if verification_badge is already fetched
    if "verification_badge" not in content:
        # Add verification_badge to the select query
        content = content.replace("supabase.from('candidates').select('profile_score')", "supabase.from('candidates').select('profile_score, verification_badge')")
        
        # Add badge UI next to the name
        content = content.replace("<h2 className=\"text-2xl font-bold text-gray-900\">{passportData.name}</h2>", "<h2 className=\"text-2xl font-bold text-gray-900 flex items-center gap-2\">{passportData.name} {data?.verification_badge && <span className=\"text-emerald-500 bg-emerald-50 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-200\"><ShieldCheck size={14}/> Verified Candidate</span>}</h2>")
        
        # Ensure ShieldCheck is imported
        if "ShieldCheck" not in content:
            content = content.replace("import { Shield, CheckCircle", "import { Shield, CheckCircle, ShieldCheck")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated candidate passport with Verification Badge")
    else:
        print("Badge already present")
else:
    print("File not found")
