with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    start = content.find("const handleFileUpload")
    end = content.find("const handleSave", start)
    print(content[start:end])
