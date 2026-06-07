# -*- coding: utf-8 -*-
import re

with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'const res = await fetch\(`\$\{API_URL\}/api/auth/login`, \{[\s\S]*?toast\(\'success\' , \'Welcome back!\', \'Login successful\'\);'

new_login = """        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
  
        if (authError) {
          throw new Error(authError.message);
        }
        
        // Fetch user role from public.users table to know where to route
        const { data: userData } = await supabase.from('users').select('*').eq('id', authData.user.id).single();
        const role = userData?.role || 'candidate';
        const name = userData?.name || 'User';

        login(authData.session.access_token, {
          id: authData.user.id,
          email: authData.user.email,
          role: role,
          name: name
        });
        
        toast('success' , 'Welcome back!', 'Login successful');
        const user = { role }; // Local mock for router push"""

if re.search(pattern, content):
    content = re.sub(pattern, new_login, content)
    with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED")
