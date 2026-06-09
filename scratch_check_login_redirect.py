import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines[30:70]):
        print(f"L{30+i}: {line.rstrip()}")
