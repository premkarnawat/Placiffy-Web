# -*- coding: utf-8 -*-
import os

with open(r"app\company\workspace\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the select query
content = content.replace("select('id, title')", "select('id, job_title')")

# Replace the mapping
content = content.replace("j.title", "j.job_title")

with open(r"app\company\workspace\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Company Workspace to use the strict 'job_title' schema instead of 'title'")
