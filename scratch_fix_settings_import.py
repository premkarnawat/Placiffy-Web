with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\settings\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    'import { Settings as SettingsIcon, UploadCloud, Loader2 } from "lucide-react";',
    'import { Settings as SettingsIcon, UploadCloud, Loader2, ShieldCheck } from "lucide-react";'
)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\settings\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed ShieldCheck import in company settings")
