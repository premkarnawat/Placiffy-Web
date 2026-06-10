with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    print(content[content.find("parse-resume")-500:content.find("parse-resume")+1000])
