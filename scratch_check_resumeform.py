with open(r"components\candidate\profile\ResumeForm.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:60]))
