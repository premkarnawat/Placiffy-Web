import sys
sys.stdout.reconfigure(encoding="utf-8")

with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    print("=== COMPANY DASHBOARD ===")
    print(content[:2500])
