import os

directory = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin"
files_to_check = [
    "companies/page.tsx",
    "jobs/page.tsx",
    "verification/page.tsx",
    "passports/page.tsx",
    "messages/page.tsx",
    "support/page.tsx",
    "notifications/page.tsx"
]

for file_path in files_to_check:
    full_path = os.path.join(directory, file_path)
    if os.path.exists(full_path):
        print(f"\n--- {file_path} exists ---")
        with open(full_path, "r", encoding="utf-8-sig") as f:
            content = f.read()
            print(f"Length: {len(content)} chars")
            # print a snippet
            print(content[:300] + "...")
    else:
        print(f"\n--- {file_path} DOES NOT EXIST ---")

