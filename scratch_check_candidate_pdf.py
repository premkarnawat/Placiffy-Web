with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    if "pdfjs" in content:
        lines = content.splitlines()
        for idx, line in enumerate(lines):
            if "pdfjs" in line:
                print(f"Line {idx+1}: {line}")
