# -*- coding: utf-8 -*-
with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

proper_login = """      // Verify role natively
      let actualRole = 'candidate';
      
      const { data: company } = await supabase.from('companies').select('id').eq('user_id', data.user.id).maybeSingle();
      if (company) {
          actualRole = 'company';
      } else if (data.user.email === 'admin@placify.com' || data.user.user_metadata?.role === 'admin') {
          actualRole = 'admin';
      }

      if (actualRole !== role) {
          toast("info", "Role Redirect", `You logged in with a ${actualRole} account. Redirecting to your dashboard...`);
      } else {
          toast("success", "Login Successful", "Welcome back!");
      }"""

content = re.sub(r'      // Verify role.*?toast\("success", "Login Successful", "Welcome back!"\);\n      \}', proper_login, content, flags=re.DOTALL)

with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched Login Page successfully!")
