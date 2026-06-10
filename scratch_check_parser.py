with open(r"app\api\candidate\parse-resume\route.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:60]))
