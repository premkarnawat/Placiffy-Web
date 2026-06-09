# -*- coding: utf-8 -*-
with open(r"lib\auth-context.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will replace the entire getSession and onAuthStateChange block.
old_block_pattern = r"    // 2\. Check Supabase Auth \(OAuth flow\).*?    \}\);\n"

new_block = """    // 2. Check Supabase Auth (OAuth flow)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        
        let role = localStorage.getItem('userRole') || 'candidate';
        const { data: company } = await supabase.from('companies').select('id').eq('user_id', session.user.id).maybeSingle();
        if (company) role = 'company';
        
        const sbUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || (role === 'company' ? 'Company User' : 'Candidate'),
          role: role
        };
        setUser(sbUser);
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(sbUser));
        localStorage.setItem('userRole', role);
      }
      setIsLoading(false);
    });

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setToken(session.access_token);
        
        let role = localStorage.getItem('userRole') || 'candidate';
        const { data: company } = await supabase.from('companies').select('id').eq('user_id', session.user.id).maybeSingle();
        if (company) role = 'company';

        const sbUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || (role === 'company' ? 'Company User' : 'Candidate'),
          role: role
        };
        setUser(sbUser);
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(sbUser));
        localStorage.setItem('userRole', role);
      }
    });
"""

if re.search(old_block_pattern, content, flags=re.DOTALL):
    content = re.sub(old_block_pattern, new_block, content, flags=re.DOTALL)
    with open(r"lib\auth-context.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed auth context role hardcoding!")
else:
    print("Could not find the block to replace")
