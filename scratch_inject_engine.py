# -*- coding: utf-8 -*-
import re

with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

completion_engine = """
      // NAUKRI-STYLE PROFILE COMPLETION ENGINE (10% per section)
      let completionScore = 0;
      
      // 1. Resume (10%)
      const { data: cData } = await supabase.from('candidates').select('resume_url').eq('id', candidateId).single();
      if (cData?.resume_url) completionScore += 10;
      
      // 2. Personal Details (10%)
      if (formData.personal.headline && formData.personal.summary && formData.personal.location) completionScore += 10;
      
      // 3. Education (10%)
      if (formData.education && formData.education.length > 0) completionScore += 10;
      
      // 4. Experience (10%)
      if (formData.experience && formData.experience.length > 0) completionScore += 10;
      
      // 5. Skills (10%) - Assuming stored in summary/headline for now, give partial if summary exists
      if (formData.personal.summary && formData.personal.summary.length > 20) completionScore += 10;
      
      // 6. Projects (10%)
      if (formData.projects && formData.projects.length > 0) completionScore += 10;
      
      // 7. Certifications (10%)
      if (formData.certifications && formData.certifications.length > 0) completionScore += 10;
      
      // 8. Portfolio/Links (10%)
      if (formData.links && formData.links.length > 0) completionScore += 10;
      
      // 9. Preferences/CTC (10%)
      if (formData.preferences.expected_salary && formData.preferences.notice_period) completionScore += 10;
      
      // 10. Profile Photo (10%)
      if (formData.personal.profile_photo_url) completionScore += 10;

      // Ensure it does not exceed 100
      completionScore = Math.min(100, completionScore);

      // Save Completion Score back to database
      await supabase.from('candidates').update({ profile_completion_pct: completionScore }).eq('id', candidateId);

      // Automatically generate ATS vector embeddings in the background
"""

content = content.replace("      // Automatically generate ATS vector embeddings in the background", completion_engine)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected dynamic Naukri-Style Completion Engine into profile save logic!")
