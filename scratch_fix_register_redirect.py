# -*- coding: utf-8 -*-
with open(r"app\company\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Inject the useAuth import
content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { useAuth } from '@/lib/auth-context';")

# Inject the useAuth hook inside the component
content = content.replace("  const router = useRouter();\n  const { toast }", "  const router = useRouter();\n  const { login } = useAuth();\n  const { toast }")

# Inject the login() call before router.push
submit_patch = """
      toast("success", "Company Registered", "Your workspace has been successfully created.");
      
      // Synchronously hydrate React Context to prevent the Layout Guard from rejecting the user
      if (authData.session?.access_token) {
        login(authData.session.access_token, {
          id: authData.user.id,
          email: authData.user.email || '',
          name: formData.contact_name || 'Company User',
          role: 'company'
        });
        await new Promise(resolve => setTimeout(resolve, 100)); // Ensure state propagates
      }

      router.push("/company/dashboard");
"""

content = content.replace('      toast("success", "Company Registered", "Your workspace has been successfully created.");\n      router.push("/company/dashboard");', submit_patch)

with open(r"app\company\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected React Context hydration into Company Registration to permanently fix the login redirect bug!")
