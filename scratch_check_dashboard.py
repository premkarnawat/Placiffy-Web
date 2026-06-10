import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\candidate\dashboard\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:100]))
