with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    if "const [atsScore, setAtsScore] = useState<number | null>(null);" in content:
        print("atsScore added successfully")
    else:
        print("FAILED to add atsScore")
