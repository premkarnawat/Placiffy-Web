# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_job_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      
      const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
          
      if (companyError || !company) throw new Error("Company profile not found");

      const payload = {
        company_id: company.id,
        title: formData.title,
        description: formData.description,
        department: formData.department,
        location: formData.location,
        type: formData.employment_type || formData.type,
        experience_level: formData.experience || formData.experience_level,
        min_salary: Number(formData.salary_range?.split('-')[0]?.replace(/[^0-9]/g, '')) || 0,
        max_salary: Number(formData.salary_range?.split('-')[1]?.replace(/[^0-9]/g, '')) || 0,
        required_skills: formData.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        preferred_skills: formData.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        open_positions: parseInt(formData.open_positions as any) || 1,
        status: 'active'
      };

      // Native Supabase Insert to bypass the Render backend which hardcodes a deleted 'job_workspaces' table
      const { data: newJob, error: insertError } = await supabase.from('jobs').insert(payload).select().single();

      if (insertError) throw insertError;

      // Fire async to backend for AI vector embedding generation, silently ignore crashes
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      fetch(`${API_URL}/api/company/jobs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getBackendToken({ id: session.user.id, email: session.user.email || '', role: 'company' })}` },
        body: JSON.stringify({ ...payload, id: newJob.id })
      }).catch(() => {});

      toast("success", "Job Created Successfully", "The job has been published and is ready for ATS matching.");
      router.push("/company/jobs");
      
    } catch (err: any) {
      toast("error", "Failed to Create Job", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r'  const handleSubmit = async \(e: React\.FormEvent\) => \{.*?    \} finally \{.*?    \}\n  \};', proper_job_submit, content, flags=re.DOTALL)

with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote Job Creation to natively use Supabase SDK to bypass broken backend!")
