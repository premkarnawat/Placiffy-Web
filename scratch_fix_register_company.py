# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_company_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirm_password) {
        return toast("error", "Passwords do not match", "Please ensure both passwords are the same.");
      }
      return setStep(2);
    }

    setLoading(true);
    try {
      // 1. Native Supabase Auth SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.official_email,
          password: formData.password,
          options: {
              data: {
                  full_name: formData.contact_name,
                  role: 'company'
              }
          }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      // 2. Insert into Companies table natively
      const fullPhone = `${formData.country_code} ${formData.phone}`;
      
      const { error: insertError } = await supabase.from('companies').insert({
          user_id: authData.user.id,
          name: formData.name,
          email: formData.official_email,
          phone: fullPhone,
          website: formData.website,
          industry: formData.industry,
          size: formData.size,
          hq_location: formData.hq_location,
          linkedin_url: formData.linkedin_url,
          gst: formData.gst,
          logo_url: logoUrl
      });

      if (insertError) {
          // If insert fails, we should alert them but they are technically auth'd. 
          // Usually we'd want to rollback or handle this, but for now just throw.
          throw insertError;
      }

      // Fire off to the backend asynchronously just in case it does vector embeddings or webhooks, 
      // but do not wait for it or let it break the flow if it times out!
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      fetch(`${API_URL}/api/company/onboard-async`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: authData.user.id })
      }).catch(e => console.error("Async backend sync failed", e));

      toast("success", "Company Registered", "Your workspace has been successfully created.");
      router.push("/company/dashboard");

    } catch (err: any) {
      toast("error", "Registration Failed", err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r'  const handleSubmit = async \(e: React\.FormEvent\) => \{.*?    \} catch \(err: any\) \{.*?    \} finally \{.*?    \}\n  \};', proper_company_submit, content, flags=re.DOTALL)

with open(r"app\company\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote company registration to use native Supabase SDK!")
