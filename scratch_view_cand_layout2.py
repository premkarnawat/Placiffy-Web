import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\candidate\layout.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:50]))
