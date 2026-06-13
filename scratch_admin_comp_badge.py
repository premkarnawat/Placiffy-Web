import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\page.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "verification_badge" not in content:
        content = content.replace("select('*')", "select('*, verification_badge')")
        
        target = "className=\"font-bold text-slate-900 group-hover:text-blue-600 transition-colors block\">{company.name}</div>"
        replacement = "className=\"font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1\">\n                           {company.name}\n                           {company.verification_badge && <ShieldCheck size={14} className=\"text-emerald-500\" title=\"Verified Employer\"/>}\n                         </div>"
        content = content.replace(target, replacement)
        
        if "ShieldCheck" not in content:
            content = content.replace("import { Search,", "import { Search, ShieldCheck,")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated admin companies page with badge")
    else:
        print("Badge already in admin companies")
