import os

routes = [
    "app/candidate/profile",
    "app/candidate/profile/edit",
    "app/candidate/jobs",
    "app/candidate/applications",
    "app/candidate/saved-jobs",
    "app/candidate/messages",
    "app/candidate/settings",
    "app/candidate/notifications",
    "app/candidate/passport",
    "app/candidate/verification",
    "app/candidate/support"
]

template = """import React from 'react';

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{TITLE}</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">This module is currently under construction. Please check back later.</p>
      </div>
    </div>
  );
}
"""

for route in routes:
    os.makedirs(route, exist_ok=True)
    title = route.split('/')[-1].replace('-', ' ').title()
    if title == "Profile": title = "Candidate Profile"
    if title == "Edit": title = "Edit Profile"
    
    file_path = os.path.join(route, "page.tsx")
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(template.replace("{TITLE}", title))
        print(f"Created: {file_path}")

print("All routes created successfully!")
