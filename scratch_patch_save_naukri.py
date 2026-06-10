# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update handleSave to include the newly mapped Naukri-style fields
handle_save_patch = """
      const { error: candErr } = await supabase.from('candidates').update({
        location: formData.personal.location || null,
        headline: formData.personal.headline || null,
        summary: formData.personal.summary || null,
        experience_years: parseInt(formData.personal.experience_years) || 0
      }).eq('id', candidateId);
      if (candErr) throw new Error("Failed to update candidate record: " + candErr.message);

      const prefs = {
        candidate_id: candidateId, 
        gender: formData.personal.gender || null,
        date_of_birth: formData.personal.date_of_birth || null,
        mobile_number: formData.personal.mobile_number || null,
        current_address: formData.personal.current_address || null,
        city: formData.personal.city || null,
        state: formData.personal.state || null,
        country: formData.personal.country || null,
        pincode: formData.personal.pincode || null,
        nationality: formData.personal.nationality || null,
        current_job_role: formData.preferences.current_job_role || null,
        industry: formData.preferences.industry || null,
        current_ctc: formData.preferences.current_ctc ? parseFloat(formData.preferences.current_ctc) : null,
        expected_salary: formData.preferences.expected_salary ? parseFloat(formData.preferences.expected_salary) : null,
        notice_period: formData.preferences.notice_period || null,
        preferred_location: formData.preferences.preferred_location || null,
        work_mode: formData.preferences.work_mode || null,
        employment_type: formData.preferences.employment_type || null,
        availability_status: formData.preferences.availability_status || null
      };
"""

content = re.sub(r'      const \{ error: candErr \} = await supabase.*?availability_status: formData\.preferences\.availability_status \|\| null\n      \};', handle_save_patch, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Wired new Naukri fields into the handleSave database update logic!")
