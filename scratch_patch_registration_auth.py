# -*- coding: utf-8 -*-
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We need to make sure the handleRegister sets the role correctly using login()
patch_register = """
      // Auto login
      login(sessionData.session.access_token, {
        id: sessionData.user.id,
        email: sessionData.user.email || '',
        name: formData.headline || 'Candidate',
        role: 'candidate'
      });

      toast("success", "Registration Successful", "Welcome to Placify!");
      router.push("/candidate/dashboard");"""

content = re.sub(r'      // Auto login.*?router\.push\("/candidate/dashboard"\);', patch_register, content, flags=re.DOTALL)

with open(r"app\candidate\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    comp_content = f.read()

comp_patch = """
      // Auto login
      login(authData.session.access_token, {
        id: authData.user.id,
        email: authData.user.email || '',
        name: formData.name || 'Company User',
        role: 'company'
      });

      toast("success", "Registration Successful", "Welcome to Placify!");
      router.push("/company/dashboard");"""

comp_content = re.sub(r'      // Auto login.*?router\.push\("/company/dashboard"\);', comp_patch, comp_content, flags=re.DOTALL)

with open(r"app\company\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(comp_content)

print("Registration Flows patched with explicit role-based login session creation!")
