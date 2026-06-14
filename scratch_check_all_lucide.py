import os

files = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\[id]\page.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8-sig") as f:
        content = f.read()
        import_stmt = [line for line in content.split('\n') if "lucide-react" in line]
        print(f"{os.path.basename(file)}: {import_stmt}")
