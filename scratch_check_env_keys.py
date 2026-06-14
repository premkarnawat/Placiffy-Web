import os
try:
    with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\.env", "r") as f:
        print("--- .env ---")
        for line in f:
            if "SUPABASE" in line:
                print(line.split("=")[0] + "=" + line.split("=")[1][:5] + "...")
except:
    pass

try:
    with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\.env.local", "r") as f:
        print("--- .env.local ---")
        for line in f:
            if "SUPABASE" in line:
                print(line.split("=")[0] + "=" + line.split("=")[1][:5] + "...")
except:
    pass
