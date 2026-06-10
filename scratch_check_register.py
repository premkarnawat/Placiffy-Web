with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    print("=== IMPORTS ===")
    print(content[:500])
    print("=== SUBMIT ===")
    print(content[content.find("const handleSubmit ="):content.find("return (")])
