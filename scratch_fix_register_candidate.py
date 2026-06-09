# -*- coding: utf-8 -*-
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_candidate_submit = """  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Resume to Storage if exists
      let resume_url = "";
      if (resumeFile) {
        const fileName = `resume_${Date.now()}_${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, resumeFile);
        if (!uploadError) {
          const { data } = supabase.storage.from("resumes").getPublicUrl(fileName);
          resume_url = data.publicUrl;
        }
      }

      // 2. Native Supabase Auth SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
              data: {
                  full_name: formData.headline, // basic fallback
                  role: 'candidate'
              }
          }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      // 3. Insert into Candidates table natively
      const { error: insertError } = await supabase.from('candidates').insert({
          user_id: authData.user.id,
          email: authData.email,
          headline: formData.headline,
          summary: formData.summary,
          location: formData.location,
          current_company: formData.current_company,
          current_role: formData.current_role,
          skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
          experience_years: Number(formData.experience_years),
          resume_url,
          profile_photo_url: formData.profile_photo_url
      });

      if (insertError) {
          throw insertError;
      }

      // Fire off to backend for AI vector embeddings asynchronously
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      fetch(`${API_URL}/api/candidate/onboard-async`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: authData.user.id })
      }).catch(e => console.error("Async backend sync failed", e));

      toast("success", "Profile Created", "Welcome to Placify!");
      router.push("/candidate/dashboard");

    } catch (err: any) {
      toast("error", "Registration Failed", err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r'  const handleFinalSubmit = async \(e: React\.FormEvent\) => \{.*?    \} catch \(err: any\) \{.*?    \} finally \{.*?    \}\n  \};', proper_candidate_submit, content, flags=re.DOTALL)

with open(r"app\candidate\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote candidate registration to use native Supabase SDK!")
