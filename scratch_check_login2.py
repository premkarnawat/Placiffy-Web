with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[40:80]):
        print(f"L{40+i}: {line.rstrip()}")
