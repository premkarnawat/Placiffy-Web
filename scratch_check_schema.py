import json

try:
    with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\types\supabase.ts", "r", encoding="utf-8") as f:
        print(f.read()[:2000])
except Exception as e:
    print(e)
