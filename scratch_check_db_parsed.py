with open(r"c:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_restructure.sql", "r", encoding="utf-8-sig") as f:
    for line in f.readlines():
        if "parsed_" in line or "text" in line.lower() or "resume" in line.lower():
            pass
