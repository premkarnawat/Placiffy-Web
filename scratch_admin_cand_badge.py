import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "verification_badge" not in content:
        content = content.replace("select('*')", "select('*, verification_badge')")
        
        target = "className=\"font-bold text-slate-900\">{candidate.full_name || 'Anonymous'}</div>"
        replacement = "className=\"font-bold text-slate-900 flex items-center gap-1\">\n                           {candidate.full_name || 'Anonymous'}\n                           {candidate.verification_badge && <ShieldCheck size={14} className=\"text-emerald-500\" title=\"Verified Candidate\"/>}\n                         </div>"
        content = content.replace(target, replacement)
        
        if "ShieldCheck" not in content:
            content = content.replace("import { Search,", "import { Search, ShieldCheck,")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated admin candidates page with badge")
    else:
        print("Badge already in admin candidates")
