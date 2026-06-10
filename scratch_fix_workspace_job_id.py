# -*- coding: utf-8 -*-
with open(r"app\company\workspace\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the select query
content = content.replace("select('id, job_title')", "select('job_id, job_title')")

# Replace jobsData mapping
content = content.replace("jobsData[0].id", "jobsData[0].job_id")
content = content.replace("j.id", "j.job_id")

# Double check if I used j.id somewhere else
content = content.replace("value={j.id}", "value={j.job_id}")
content = content.replace("key={j.id}", "key={j.job_id}")

with open(r"app\company\workspace\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Company Workspace to map jobs to 'job_id' instead of 'id'")
