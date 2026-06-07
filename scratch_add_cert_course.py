# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """        {activeTab === 'certifications' && (
          <ArrayForm
            title="Certifications & Licenses"
            description="Add professional certifications to boost your Verification Score."
            items={profileData.certifications}
            tableName="candidate_certifications"
            candidateId={user?.id}
            fields={[
              { name: 'name', label: 'Certificate Title', type: 'text', required: true },
              { name: 'issuer', label: 'Issuing Organization', type: 'text', required: true },
              { name: 'issue_date', label: 'Issue Date', type: 'date' },
              { name: 'expiration_date', label: 'Expiration Date', type: 'date' },
              { name: 'credential_id', label: 'Credential ID', type: 'text' },
              { name: 'credential_url', label: 'Credential URL', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
            onUpdate={fetchProfile}
          />
        )}

        {activeTab === 'courses' && (
          <ArrayForm
            title="Courses & Training"
            description="Highlight relevant coursework or bootcamps."
            items={profileData.courses}
            tableName="candidate_courses"
            candidateId={user?.id}
            fields={[
              { name: 'course_name', label: 'Course Name', type: 'text', required: true },
              { name: 'provider', label: 'Provider / Institution', type: 'text', required: true },
              { name: 'completion_date', label: 'Completion Date', type: 'date' },
              { name: 'skills_learned', label: 'Skills Learned (comma separated)', type: 'text' },
              { name: 'certificate_url', label: 'Certificate URL', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
            onUpdate={fetchProfile}
          />
        )}"""

content = content.replace("{/* Add placeholders for certifications, courses if needed */}", replacement)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
