import os
import shutil

edit_page = r"app\candidate\profile\edit\page.tsx"
profile_page = r"app\candidate\profile\page.tsx"
edit_dir = r"app\candidate\profile\edit"

if os.path.exists(edit_page):
    shutil.copy2(edit_page, profile_page)
    shutil.rmtree(edit_dir)
    print("Promoted Candidate Profile Editor to main profile page and deleted redundant edit folder.")
else:
    print("Edit page not found.")
