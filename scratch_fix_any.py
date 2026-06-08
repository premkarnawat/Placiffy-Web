# -*- coding: utf-8 -*-
import os, re

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# AI Assistant
replace_in_file("app/company/ai-assistant/page.tsx", [
    ("prev =>", "(prev: any) =>"),
    ("onChange={e =>", "onChange={(e: any) =>")
])

# Billing
replace_in_file("app/company/billing/page.tsx", [
    ("invoices.map(inv =>", "invoices.map((inv: any) =>")
])

# Candidates
replace_in_file("app/company/candidates/page.tsx", [
    ("map(s =>", "map((s: string) =>"),
    ("filter(c =>", "filter((c: any) =>"),
    ("every(rs =>", "every((rs: string) =>"),
    ("map(c =>", "map((c: any) =>"),
    ("onChange={e =>", "onChange={(e: any) =>"),
    ("map(j =>", "map((j: any) =>"),
    ("candidates.map((c) =>", "candidates.map((c: any) =>")
])

# Dashboard
replace_in_file("app/company/dashboard/page.tsx", [
    ("NAV.map(item =>", "NAV.map((item: any) =>"),
    ("BOTTOM_NAV.map(item =>", "BOTTOM_NAV.map((item: any) =>"),
    ("map(v =>", "map((v: string) =>"),
    ("map(n=>", "map((n: string) =>")
])

# Jobs
replace_in_file("app/company/jobs/page.tsx", [
    ("jobs.map((job) =>", "jobs.map((job: any) =>")
])

# Job Create
replace_in_file("app/company/jobs/create/page.tsx", [
    ("prev =>", "(prev: any) =>"),
    ("map(s =>", "map((s: string) =>"),
    ("onChange={e =>", "onChange={(e: any) =>")
])

# Messages
replace_in_file("app/company/messages/page.tsx", [
    ("shorts.map(s =>", "shorts.map((s: any) =>"),
    ("payload =>", "(payload: any) =>"),
    ("prev =>", "(prev: any) =>"),
    ("conversations.map(c =>", "conversations.map((c: any) =>"),
    ("onChange={e =>", "onChange={(e: any) =>")
])

# Register
replace_in_file("app/company/register/page.tsx", [
    ("prev =>", "(prev: any) =>"),
    ("onChange={e =>", "onChange={(e: any) =>")
])

# Settings
replace_in_file("app/company/settings/page.tsx", [
    ("onChange={e =>", "onChange={(e: any) =>")
])

# Support
replace_in_file("app/company/support/page.tsx", [
    ("onChange={e =>", "onChange={(e: any) =>"),
    ("tickets.map(t =>", "tickets.map((t: any) =>")
])

# Workspace
replace_in_file("app/company/workspace/page.tsx", [
    ("shortlists.map(s =>", "shortlists.map((s: any) =>"),
    ("find(c =>", "find((c: any) =>"),
    ("prev => prev.map(c =>", "(prev: any) => prev.map((c: any) =>"),
    ("jobs.map(j =>", "jobs.map((j: any) =>"),
    ("STAGES.map(stage =>", "STAGES.map((stage: string) =>"),
    ("candidates.filter(c =>", "candidates.filter((c: any) =>"),
    ("stageCandidates.map(cand =>", "stageCandidates.map((cand: any) =>")
])

print("Fixed implicit any in React components!")
