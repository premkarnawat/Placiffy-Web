# -*- coding: utf-8 -*-
files = [
    r"app\candidate\messages\page.tsx",
    r"app\admin\messages\page.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("return () => supabase.removeChannel(channel);", "return () => { supabase.removeChannel(channel); };")
    content = content.replace("return () => {\n        supabase.removeChannel(channel);\n      };", "return () => { supabase.removeChannel(channel); };")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixed useEffect Promise destructor!")
