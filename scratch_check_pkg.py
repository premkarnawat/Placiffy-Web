import json

try:
    with open("c:\\Users\\premk\\.gemini\\antigravity\\playground\\ruby-galaxy\\package.json", "r") as f:
        print(f.read())
except Exception as e:
    print(e)
