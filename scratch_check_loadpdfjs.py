with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    start = content.find("const loadPdfJs")
    end = content.find("};", start) + 2
    print(content[start:end])
