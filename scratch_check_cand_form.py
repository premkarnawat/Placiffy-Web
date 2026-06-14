with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for line in lines:
        if "label" in line.lower() or "input" in line.lower():
            if "type=\"file\"" in line or "type=\"text\"" in line:
                print(line.strip())
