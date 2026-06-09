# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\company\messages\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "supabase.channel" in content:
    print("Messages has realtime!")
else:
    print("Messages does NOT have realtime.")
