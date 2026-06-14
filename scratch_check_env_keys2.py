import os
for k, v in os.environ.items():
    if "SUPA" in k:
        print(f"{k}")
