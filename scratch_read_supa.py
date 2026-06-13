import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\lib\supabase.ts"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        print(f.read()[:500])
else:
    print("lib/supabase.ts not found.")
