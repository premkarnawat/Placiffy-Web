with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\profile\edit\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

if "ShieldCheck" in content and "import { Loader2, ShieldCheck" not in content and "import { Loader2" in content:
    content = content.replace("import { Loader2,", "import { Loader2, ShieldCheck,")
    with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\profile\edit\page.tsx", "w", encoding="utf-8-sig") as f:
        f.write(content)
    print("Fixed ShieldCheck import in candidate edit profile")
else:
    print("Candidate edit profile is fine")
