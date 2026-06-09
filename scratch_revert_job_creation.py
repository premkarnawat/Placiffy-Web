# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_job_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Always get the fresh, native Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";

      const payload = {
        ...formData,
        required_skills: formData.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        preferred_skills: formData.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        open_positions: parseInt(formData.open_positions as any) || 1,
        custom_fields: customFields
      };

      const res = await fetch(`${API_URL}/api/company/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create job workspace");
      }

      toast("success", "Job Workspace Created", "AI is currently generating the pgvector embedding for this job in the background.");
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

print("Reverted Job Creation to use the backend, but securely sending the native Supabase session.access_token!")
