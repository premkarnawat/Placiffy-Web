# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
# Just replace everything from {activeSection === 'certifications' && ( down to the end of activeSection === 'courses'
# Since it's the last part of the file, we can be aggressive.

cert_block = """{activeSection === 'certifications' && (
          <ArrayForm
            title="Certifications & Licenses"
            items={profileData.certifications}
            fields={[
              { name: 'name', label: 'Certificate Title', type: 'text', required: true },
              { name: 'issuer', label: 'Issuing Organization', type: 'text', required: true },
              { name: 'issue_date', label: 'Issue Date', type: 'date' },
              { name: 'expiration_date', label: 'Expiration Date', type: 'date' },
              { name: 'credential_id', label: 'Credential ID', type: 'text' },
              { name: 'credential_url', label: 'Credential URL', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
            onUpdate={(d) => setProfileData({...profileData, certifications: d})}
            renderItem={(item: any) => (
              <div><h4 className="font-bold">{item.name || item.title}</h4><p className="text-sm text-gray-500">{item.issuer || item.organization}</p></div>
            )}
          />
        )}

        {activeSection === 'courses' && (
          <ArrayForm
            title="Courses & Training"
            items={profileData.courses}
            fields={[
              { name: 'course_name', label: 'Course Name', type: 'text', required: true },
              { name: 'provider', label: 'Provider / Institution', type: 'text', required: true },
              { name: 'completion_date', label: 'Completion Date', type: 'date' },
              { name: 'skills_learned', label: 'Skills Learned (comma separated)', type: 'text' },
              { name: 'certificate_url', label: 'Certificate URL', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
            onUpdate={(d) => setProfileData({...profileData, courses: d})}
            renderItem={(item: any) => (
              <div><h4 className="font-bold">{item.course_name || item.title}</h4><p className="text-sm text-gray-500">{item.provider || item.institution}</p></div>
            )}
          />
        )}"""

content = re.sub(r"\{activeSection === 'certifications' && \(\s*<ArrayForm.*?activeSection === 'courses' && \(\s*<ArrayForm.*?\)\s*\}", cert_block, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
