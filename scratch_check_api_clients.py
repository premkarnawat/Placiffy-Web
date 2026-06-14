import os
import glob

files = glob.glob(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\**\*.ts", recursive=True)
for file in files:
    with open(file, "r", encoding="utf-8-sig") as f:
        content = f.read()
        if "createClient(" in content or "createRouteHandlerClient(" in content or "createServerComponentClient(" in content or "supabase" in content:
            print(f"File: {os.path.basename(file)}")
            lines = content.split('\n')
            for i in range(min(15, len(lines))):
                if "supabase" in lines[i].lower() or "auth" in lines[i].lower():
                    print(f"  {lines[i].strip()}")
