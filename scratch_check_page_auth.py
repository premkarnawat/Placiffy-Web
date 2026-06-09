import os
for page in ["app/company/dashboard/page.tsx", "app/company/messages/page.tsx"]:
    if os.path.exists(page):
        print(f"--- {page} ---")
        with open(page, "r", encoding="utf-8") as f:
            lines = f.readlines()
            for i in range(min(50, len(lines))):
                print(lines[i].rstrip())
        print("------------------\n")
