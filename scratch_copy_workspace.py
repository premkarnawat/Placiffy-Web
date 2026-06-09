import shutil
import os

source = r"C:\Users\premk\.gemini\antigravity\brain\e6b64289-9211-40dc-9169-31667b151e5b\workspace_page.tsx"
dest = r"app\company\workspace\page.tsx"

if os.path.exists(source):
    shutil.copy2(source, dest)
    print("Successfully copied subagent's workspace code to the project!")
else:
    print("Source artifact not found.")
