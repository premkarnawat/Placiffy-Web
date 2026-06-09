# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"app\company\settings\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[:100]):
    if "company_profiles" in line or "companies" in line or "supabase" in line:
        print(f"L{i}: {line.rstrip()}")
