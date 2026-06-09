import os

md_path = r"C:\Users\premk\.gemini\antigravity\brain\e1f762ea-b8fc-44de-bb22-2468c5ba5e19\candidate_portal_phase4.md"

with open(md_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract blocks
blocks = content.split("```tsx")

personal_form = blocks[1].split("```")[0].strip()
profile_page = blocks[2].split("```")[0].strip()
passport_page = blocks[3].split("```")[0].strip()

# Write PersonalForm.tsx
os.makedirs(r"components\candidate\profile", exist_ok=True)
with open(r"components\candidate\profile\PersonalForm.tsx", "w", encoding="utf-8") as f:
    f.write(personal_form)

# Write profile page
os.makedirs(r"app\candidate\profile", exist_ok=True)
with open(r"app\candidate\profile\page.tsx", "w", encoding="utf-8") as f:
    f.write(profile_page)

# Write passport page
os.makedirs(r"app\candidate\passport", exist_ok=True)
with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(passport_page)

print("Successfully extracted and wrote all Phase 4 files!")
