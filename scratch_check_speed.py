with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    start = content.find("const handleFileUpload")
    end = content.find("const handleSubmit", start)
    print(content[start:end])
