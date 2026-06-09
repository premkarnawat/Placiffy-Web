import os
files_to_check = [
    "lib/auth-context.tsx",
    "app/layout.tsx",
    "app/company/layout.tsx",
]
for fpath in files_to_check:
    if os.path.exists(fpath):
        print(f"--- {fpath} ---")
        with open(fpath, "r", encoding="utf-8") as f:
            print(f.read())
        print("------------------\n")
    else:
        print(f"--- {fpath} NOT FOUND ---")
