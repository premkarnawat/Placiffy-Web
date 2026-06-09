# -*- coding: utf-8 -*-
import re

# Fix Company Register
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    comp_content = f.read()

comp_content = comp_content.replace("gst: formData.gst,", "gst_number: formData.gst,")

with open(r"app\company\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(comp_content)

# Fix Candidate Register
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    cand_content = f.read()

patch_cand = """      const { data: newCand, error: insertError } = await supabase.from('candidates').insert({
          user_id: sessionData.user.id,
          headline: formData.headline,
          summary: formData.summary,
          location: formData.location,
          skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
          experience_years: Number(formData.experience_years),
          resume_url,
          profile_photo_url: formData.profile_photo_url
      }).select().single();

      if (insertError) throw insertError;

      if (formData.current_company || formData.current_role) {
         await supabase.from('candidate_experience').insert({
            candidate_id: newCand.id,
            company_name: formData.current_company || 'Unknown',
            title: formData.current_role || 'Unknown',
            is_current: true
         });
      }"""

cand_content = re.sub(r'      const \{ error: insertError \} = await supabase\.from\(\'candidates\'\)\.insert\(\{.*?\}\)', patch_cand, cand_content, flags=re.DOTALL)

with open(r"app\candidate\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(cand_content)

print("Patched Registration to match new database schema!")
