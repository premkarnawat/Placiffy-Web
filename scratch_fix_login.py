# -*- coding: utf-8 -*-
with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_login = """  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned from Supabase");

      // Verify role
      let actualRole = 'candidate';
      const { data: company } = await supabase.from('companies').select('id').eq('user_id', data.user.id).maybeSingle();
      if (company) actualRole = 'company';
      else {
          const { data: admin } = await supabase.from('admins').select('id').eq('user_id', data.user.id).maybeSingle();
          if (admin) actualRole = 'admin';
      }

      if (actualRole !== role) {
          toast("info", "Role Redirect", `You logged in with a ${actualRole} account. Redirecting to your dashboard...`);
      } else {
          toast("success", "Login Successful", "Welcome back!");
      }

      localStorage.setItem("userRole", actualRole);

      if (actualRole === 'admin') router.push('/admin/dashboard');
      else if (actualRole === 'company') router.push('/company/dashboard');
      else router.push('/candidate/dashboard');

    } catch (err: any) {
      toast("error", "Login Failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r'  const handleLogin = async \(e: React\.FormEvent\) => \{.*?  \};', proper_login, content, flags=re.DOTALL)

# Add import supabase
if "import { supabase }" not in content:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { supabase } from '@/lib/supabase';")

with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote login to use native Supabase Auth!")
