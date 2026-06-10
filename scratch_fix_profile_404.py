import os

os.makedirs(r"app\candidate\profile", exist_ok=True)

redirect_code = """import { redirect } from 'next/navigation';

export default function ProfileRedirect() {
  redirect('/candidate/profile/edit');
}
"""

with open(r"app\candidate\profile\page.tsx", "w", encoding="utf-8") as f:
    f.write(redirect_code)

print("Created redirect page to fix the 404 Error on View Profile!")
