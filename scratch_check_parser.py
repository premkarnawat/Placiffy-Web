import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\api\resume\parse-public\route.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:40]))
