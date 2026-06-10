with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    print("=== LOGIN PAGE ===")
    print(f.read()[:2000])

with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    print("\n=== COMPANY REGISTER PAGE ===")
    print(f.read()[:2000])
