# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_job_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the company profile directly
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
        type: formData.type,
        experience_level: formData.experience_level,
        min_salary: Number(formData.min_salary) || 0,
        max_salary: Number(formData.max_salary) || 0,
        required_skills: formData.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        preferred_skills: formData.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        open_positions: parseInt(formData.open_positions as any) || 1,
        custom_fields: customFields,
        status: 'active'
      };

      const { error: insertError } = await supabase.from('jobs').insert(payload);

      if (insertError) {
          throw insertError;
      }

      // Fire async to backend for AI vector embedding generation, ignore token errors
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      const token = localStorage.getItem("token") || session.access_token;
      
      fetch(`${API_URL}/api/company/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }).catch(e => console.error("Async AI embedding failed", e));

      toast("success", "Job Workspace Created", "AI is currently generating the pgvector embedding for this job in the background.");
      router.push("/company/jobs");
      
    } catch (err: any) {
      toast("error", "Failed to Create Job", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r'  const handleSubmit = async \(e: React\.FormEvent\) => \{.*?    \} finally \{.*?    \}\n  \};', proper_job_submit, content, flags=re.DOTALL)

# Also ensure supabase is imported
if "import { supabase }" not in content:
    content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { supabase } from '@/lib/supabase';")

with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote Job Creation to use native Supabase SDK!")
