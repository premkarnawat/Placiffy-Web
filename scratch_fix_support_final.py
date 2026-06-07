# -*- coding: utf-8 -*-
with open(r"app\candidate\support\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the broken catch block
content = content.replace("    }.select().single()", "    }")

# Now actually fix the supabase call properly
# It originally was:
# const { data, error } = await supabase.from('support_tickets').insert({
#   user_id: user?.id,
#   category: newTicket.category,
#   subject: newTicket.subject,
#   status: 'open',
#   priority: 'normal'
# });

import re
content = re.sub(
    r"const \{ data, error \} = await supabase\.from\('support_tickets'\)\.insert\(\{([^}]*)\}\);",
    r"const { data, error } = await supabase.from('support_tickets').insert({\1}).select().single();",
    content,
    flags=re.DOTALL
)

with open(r"app\candidate\support\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
