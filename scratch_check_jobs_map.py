with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "jobs.map" in line or "jobs.length === 0" in line:
            for j in range(max(0, i-5), min(len(lines), i+20)):
                print(f"{j+1}: {lines[j].strip()}")
            break
