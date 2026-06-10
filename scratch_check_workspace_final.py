with open(r"app\company\workspace\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    start = content.find("const fetchInitialData")
    end = content.find("} catch (e)", start)
    print(content[start:end])
