# -*- coding: utf-8 -*-
import re

with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { supabase } from '@/lib/supabase';" not in content:
    content = content.replace("import { useToast } from '@/components/ui/toast';", "import { useToast } from '@/components/ui/toast';\nimport { supabase } from '@/lib/supabase';")

handle_social_regex = r"const handleSocialLogin = \(provider: string\) => \{[^}]+\};"

real_handle_social = """const handleSocialLogin = async (provider: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as any,
        options: {
          redirectTo: `${window.location.origin}/candidate/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast('error', 'OAuth Error', err.message);
    }
  };"""

content = re.sub(handle_social_regex, real_handle_social, content)

with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
