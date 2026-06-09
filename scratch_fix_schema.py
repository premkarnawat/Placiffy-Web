# -*- coding: utf-8 -*-
import os

for path in [r"app\company\register\page.tsx", r"app\candidate\register\page.tsx"]:
    if not os.path.exists(path): continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    import re
    
    if "company" in path:
        # Remove email, phone, linkedin_url
        content = re.sub(r'\s*email: formData\.official_email,', '', content)
        content = re.sub(r'\s*phone: fullPhone,', '', content)
        content = re.sub(r'\s*linkedin_url: formData\.linkedin_url,', '', content)
        # Also remove the fullPhone declaration as it's no longer used
        content = re.sub(r'\s*const fullPhone = `\$\{formData\.country_code\} \$\{formData\.phone\}`;', '', content)
        
    elif "candidate" in path:
        # Remove email
        content = re.sub(r'\s*email: authData\.email,', '', content)
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Removed invalid schema columns from {path}")
