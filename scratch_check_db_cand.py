with open(r"c:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_restructure.sql", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "CREATE TABLE IF NOT EXISTS candidates" in line or "CREATE TABLE IF NOT EXISTS candidate_profiles" in line:
            for j in range(i, i+30):
                if j < len(lines):
                    print(lines[j].strip())
