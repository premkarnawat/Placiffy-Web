with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "handleApply" in line or "Apply" in line or "application_screening_answers" in line:
            print(f"Line {i}: {line.strip()}")
