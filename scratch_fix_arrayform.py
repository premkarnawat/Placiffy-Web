# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Fix Certifications
content = re.sub(
    r"<ArrayForm\s+title=\"Certifications & Licenses\"\s+description=\"[^\"]*\"\s+items=\{profileData\.certifications\}\s+tableName=\"[^\"]*\"\s+candidateId=\{[^\}]*\}\s+fields=\{([^}]*)\}\s+onUpdate=\{fetchProfile\}\s+/>",
    r"""<ArrayForm
            title="Certifications & Licenses"
            items={profileData.certifications}
            fields={\1}
            onUpdate={(d) => setProfileData({...profileData, certifications: d})}
            renderItem={(item: any) => (
              <div><h4 className="font-bold">{item.name || item.title}</h4><p className="text-sm text-gray-500">{item.issuer || item.organization}</p></div>
            )}
          />""",
    content,
    flags=re.DOTALL
)

# Fix Courses
content = re.sub(
    r"<ArrayForm\s+title=\"Courses & Training\"\s+description=\"[^\"]*\"\s+items=\{profileData\.courses\}\s+tableName=\"[^\"]*\"\s+candidateId=\{[^\}]*\}\s+fields=\{([^}]*)\}\s+onUpdate=\{fetchProfile\}\s+/>",
    r"""<ArrayForm
            title="Courses & Training"
            items={profileData.courses}
            fields={\1}
            onUpdate={(d) => setProfileData({...profileData, courses: d})}
            renderItem={(item: any) => (
              <div><h4 className="font-bold">{item.course_name || item.title}</h4><p className="text-sm text-gray-500">{item.provider || item.institution}</p></div>
            )}
          />""",
    content,
    flags=re.DOTALL
)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
