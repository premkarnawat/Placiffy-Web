with open(r"app\api\candidate\parse-resume\route.ts", "r", encoding="utf-8") as f:
    content = f.read()
    print(content[content.find("https://generativelanguage.googleapis.com"):content.find("https://generativelanguage.googleapis.com")+150])
