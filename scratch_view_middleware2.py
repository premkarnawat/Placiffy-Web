import sys

sys.stdout.reconfigure(encoding='utf-8')

try:
    with open("middleware.ts", "r", encoding="utf-8") as f:
        print(f.read())
except Exception as e:
    print(e)
