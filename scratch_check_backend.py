import os
for root, dirs, files in os.walk("."):
    if "main.py" in files or "requirements.txt" in files or "app.py" in files:
        print(f"Found python backend files in: {root}")
