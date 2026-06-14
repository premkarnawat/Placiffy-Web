files = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\verification\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx"
]

for file in files:
    try:
        with open(file, "r", encoding="utf-8-sig") as f:
            for line in f:
                if "useToast" in line and "import" in line:
                    print(f"{file.split(chr(92))[-3]}/{file.split(chr(92))[-2]}: {line.strip()}")
    except Exception as e:
        print(e)
