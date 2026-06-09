import os

# Frontend routes
print("--- Frontend Routes ---")
for root, dirs, files in os.walk("app"):
    if "page.tsx" in files:
        print(root.replace("\\", "/"))

# Backend routes
print("\n--- Backend Routes ---")
backend_routes = []
if os.path.exists(r"backend\app\main.py"):
    with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
        for line in f:
            if "@app." in line:
                backend_routes.append(line.strip())
for r in backend_routes:
    print(r)
