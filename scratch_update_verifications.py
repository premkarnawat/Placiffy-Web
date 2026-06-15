path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "candidates(first_name, last_name, profile_photo_url, location, email)",
    "candidates(first_name, last_name, profile_photo_url, location)"
)

with open(path, "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated Verification Center successfully.")
