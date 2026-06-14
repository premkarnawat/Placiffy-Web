with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "aadhaar_front_url" in line or "return" in line or "github_url" in line or "pan_url" in line or "linkedin_url" in line:
            print(f"Line {i}: {line.strip()}")
