# -*- coding: utf-8 -*-
import re

for filename in [r"app\login\page.tsx", r"app\register\page.tsx"]:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("const { addToast } = useToast();", "const { toast } = useToast();")
    
    # regex replace addToast({ title: 'A', message: 'B', type: 'C' }) with toast('C', 'A', 'B')
    content = re.sub(
        r"addToast\(\{\s*title:\s*([^,]+),\s*message:\s*([^,]+),\s*type:\s*([^}]+)\s*\}\)",
        r"toast(\3, \1, \2)",
        content
    )
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
