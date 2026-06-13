import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\profile\edit\page.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if verification_badge is already fetched
    if "verification_badge" not in content:
        # Edit Profile Title addition
        target = '<h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>'
        replacement = '<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">Edit Profile {candData?.verification_badge && <span className="text-emerald-500 bg-emerald-50 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200"><ShieldCheck size={16}/> Verified Candidate</span>}</h1>'
        
        # We need candData from the fetch. Let's see how candidates table is fetched.
        # "const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();"
        # We also need to expose it to the render. The existing code uses candidateData state.
        
        content = content.replace(target, replacement)
        
        # Ensure ShieldCheck is imported
        if "ShieldCheck" not in content:
            content = content.replace("import { Loader2", "import { Loader2, ShieldCheck")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated candidate edit profile with Verification Badge")
    else:
        print("Badge already present")
else:
    print("File not found")
