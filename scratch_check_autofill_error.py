with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    start_index = content.find("const handleResumeUpload")
    print(content[start_index:start_index+2000])
