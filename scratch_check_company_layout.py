import sys
sys.stdout.reconfigure(encoding="utf-8")

with open(r"app\company\layout.tsx", "r", encoding="utf-8") as f:
    print(f.read()[1000:3000])

