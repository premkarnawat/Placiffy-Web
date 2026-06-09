# -*- coding: utf-8 -*-
with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Check if useAuth is imported
if "useAuth" not in content:
    content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { useAuth } from '@/lib/auth-context';")

# Extract login from useAuth
if "const { login }" not in content:
    content = content.replace("const router = useRouter();", "const router = useRouter();\n  const { login } = useAuth();")

# Inject login call before router push
patch_login = """
      if (actualRole !== role) {
          toast("info", "Role Redirect", `You logged in with a ${actualRole} account. Redirecting to your dashboard...`);
      } else {
          toast("success", "Login Successful", "Welcome back!");
      }

      // Synchronously update React Context BEFORE routing to prevent Layout Guard rejection
      login(data.session.access_token, {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || (actualRole === 'company' ? 'Company User' : 'Candidate'),
          role: actualRole as any
      });

      // Wait a tiny bit to ensure context propagates
      await new Promise(resolve => setTimeout(resolve, 100));

      if (actualRole === 'admin') router.push('/admin');
      else if (actualRole === 'company') router.push('/company/dashboard');
      else router.push('/candidate/dashboard');
"""

content = re.sub(
    r'      if \(actualRole !== role\) \{.*?else router\.push\(\'/candidate/dashboard\'\);', 
    patch_login, 
    content, 
    flags=re.DOTALL
)

with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched Login redirect logic to fix freeze!")
