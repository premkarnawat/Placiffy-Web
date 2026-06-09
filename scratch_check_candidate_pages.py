import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== app/candidate/profile/page.tsx (first 50 lines) ===")
with open(r"app\candidate\profile\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:50]))

print("\n=== app/candidate/resume/page.tsx (first 50 lines) ===")
with open(r"app\candidate\resume\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[:50]))
