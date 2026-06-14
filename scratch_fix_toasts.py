import os
import re

directory = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company"

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8-sig") as f:
                content = f.read()

            # Replace toast({ ... variant: "destructive" ... }) with toast("error", ...)
            # Replace toast({ ... }) with toast("success", ...)
            
            # Simple regex to catch toast({ title: "...", description: "...", variant: "destructive" })
            new_content = re.sub(
                r'toast\(\{\s*title:\s*([^,]+),\s*description:\s*([^,]+)(?:,\s*variant:\s*"destructive")?\s*\}\)',
                lambda m: f'toast("error" if "destructive" in m.group(0) else "success", {m.group(1)}, {m.group(2)})',
                content
            )
            
            # Catch toast({ title: "..." }) without description
            new_content = re.sub(
                r'toast\(\{\s*title:\s*([^,}]+)\s*\}\)',
                lambda m: f'toast("success", {m.group(1)})',
                new_content
            )

            if new_content != content:
                with open(filepath, "w", encoding="utf-8-sig") as f:
                    f.write(new_content)
                print(f"Fixed toasts in {filepath}")
