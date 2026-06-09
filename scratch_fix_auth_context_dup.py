# -*- coding: utf-8 -*-
with open(r"lib\auth-context.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Let's remove the duplicated, old onAuthStateChange
# The old one starts with // Listen to Supabase auth changes and uses non-async (_event, session)
old_subscription = r'    // Listen to Supabase auth changes\n    const \{ data: \{ subscription \} \} = supabase\.auth\.onAuthStateChange\(\(_event, session\) => \{.*?    \}\);\n'

content = re.sub(old_subscription, '', content, flags=re.DOTALL)

with open(r"lib\auth-context.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Removed duplicate onAuthStateChange")
