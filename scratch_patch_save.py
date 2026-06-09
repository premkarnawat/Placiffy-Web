# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We need to replace the supabase calls in handleSave to check for errors
# Currently they look like: await supabase.from('candidates').update({...}).eq('id', candidateId);

# Let's completely rewrite the handleSave function
handle_save_regex = r"  const handleSave = async \(\) => \{.*?(?=  if \(authLoading \|\| isFetching\))"

new_handle_save = """  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!candidateId) throw new Error("Candidate record not found");

      const { error: candErr } = await supabase.from('candidates').update({
        location: formData.personal.location || null,
        headline: formData.personal.headline || null,
        summary: formData.personal.summary || null,
        experience_years: parseInt(formData.personal.experience_years) || 0
      }).eq('id', candidateId);
      if (candErr) throw new Error("Failed to update candidate record: " + candErr.message);

      const prefs = {
        candidate_id: candidateId, 
        expected_salary: formData.preferences.expected_salary ? parseFloat(formData.preferences.expected_salary) : null,
        notice_period: formData.preferences.notice_period || null,
        availability_status: formData.preferences.availability_status || null
      };
      
      const { data: pCheck } = await supabase.from('candidate_profiles').select('id').eq('candidate_id', candidateId);
      if (pCheck && pCheck.length > 0) {
        const { error: pErr } = await supabase.from('candidate_profiles').update(prefs).eq('candidate_id', candidateId);
        if (pErr) throw new Error("Failed to update profile preferences: " + pErr.message);
      } else {
        const { error: pErr } = await supabase.from('candidate_profiles').insert(prefs);
        if (pErr) throw new Error("Failed to insert profile preferences: " + pErr.message);
      }

      const { error: edDelErr } = await supabase.from('candidate_education').delete().eq('candidate_id', candidateId);
      if (edDelErr) throw new Error("Failed to clear education: " + edDelErr.message);
      if (formData.education.length) {
        const { error: edInsErr } = await supabase.from('candidate_education').insert(formData.education.map((i:any)=>({candidate_id: candidateId, institution: i.institution, degree: i.degree, field_of_study: i.field_of_study, start_date: i.start_date || null, end_date: i.end_date || null, description: i.description})));
        if (edInsErr) throw new Error("Failed to save education: " + edInsErr.message);
      }

      const { error: expDelErr } = await supabase.from('candidate_experience').delete().eq('candidate_id', candidateId);
      if (expDelErr) throw new Error("Failed to clear experience: " + expDelErr.message);
      if (formData.experience.length) {
        const { error: expInsErr } = await supabase.from('candidate_experience').insert(formData.experience.map((i:any)=>({candidate_id: candidateId, company_name: i.company_name, title: i.title, location: i.location, start_date: i.start_date || null, end_date: i.end_date || null, is_current: i.is_current || false, description: i.description})));
        if (expInsErr) throw new Error("Failed to save experience: " + expInsErr.message);
      }
      
      const { error: projDelErr } = await supabase.from('candidate_projects').delete().eq('candidate_id', candidateId);
      if (projDelErr) throw new Error("Failed to clear projects: " + projDelErr.message);
      if (formData.projects.length) {
        const { error: projInsErr } = await supabase.from('candidate_projects').insert(formData.projects.map((i:any)=>({candidate_id: candidateId, name: i.name, description: i.description, url: i.url, start_date: i.start_date || null, end_date: i.end_date || null})));
        if (projInsErr) throw new Error("Failed to save projects: " + projInsErr.message);
      }

      const { error: certDelErr } = await supabase.from('candidate_certifications').delete().eq('candidate_id', candidateId);
      if (certDelErr) throw new Error("Failed to clear certifications: " + certDelErr.message);
      if (formData.certifications.length) {
        const { error: certInsErr } = await supabase.from('candidate_certifications').insert(formData.certifications.map((i:any)=>({candidate_id: candidateId, name: i.name, issuer: i.issuer, issue_date: i.issue_date || null, url: i.url})));
        if (certInsErr) throw new Error("Failed to save certifications: " + certInsErr.message);
      }

      const { error: linkDelErr } = await supabase.from('candidate_links').delete().eq('candidate_id', candidateId);
      if (linkDelErr) throw new Error("Failed to clear links: " + linkDelErr.message);
      if (formData.links.length) {
        const { error: linkInsErr } = await supabase.from('candidate_links').insert(formData.links.map((i:any)=>({candidate_id: candidateId, platform: i.platform, url: i.url})));
        if (linkInsErr) throw new Error("Failed to save links: " + linkInsErr.message);
      }

      // Automatically generate ATS vector embeddings in the background
      fetch('/api/candidate/embed', { method: 'POST', body: JSON.stringify({ candidateId, summary: formData.personal.summary || '', headline: formData.personal.headline || '' }) }).catch(console.error);

      toast('success', 'Profile Saved', 'Your changes have been saved permanently.');
    } catch (e: any) {
      console.error(e);
      toast('error', 'Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

"""

content = re.sub(handle_save_regex, new_handle_save, content, flags=re.DOTALL)

with open(r"app\candidate\profile\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote handleSave with strict error checking, type casting, and ATS embedding hook!")
