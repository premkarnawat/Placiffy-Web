with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    print(content[content.find("const handleFileUpload"):content.find("const handleFileUpload")+2000])
