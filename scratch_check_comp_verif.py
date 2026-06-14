with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i in range(50, 110):
        if i < len(lines):
            line = lines[i].rstrip()
            if "verification_status" in line or "payload =" in line or ".insert" in line or "status:" in line:
                print(f"Line {i}: {line}")
