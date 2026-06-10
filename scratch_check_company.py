import sys
sys.stdout.reconfigure(encoding="utf-8")

with open(r"app\company\layout.tsx", "r", encoding="utf-8") as f:
    print("=== COMPANY LAYOUT ===")
    print(f.read()[:1500])

with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    print("\n=== COMPANY DASHBOARD ===")
    print(f.read()[:2000])
