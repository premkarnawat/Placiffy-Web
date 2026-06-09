# -*- coding: utf-8 -*-
with open("task.md", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("[ ] Delete legacy Fraud AI Engine", "[x] Delete legacy Fraud AI Engine")
content = content.replace("[ ] Delete legacy Trust Score Engine", "[x] Delete legacy Trust Score Engine")
content = content.replace("[ ] Delete unused sidebar navigation and menu items", "[x] Delete unused sidebar navigation and menu items")
content = content.replace("[ ] Remove mock data hardcodings", "[/] Remove mock data hardcodings (Cleared components, reviewing backend deps)")
content = content.replace("[ ] Write and execute Supabase DDL migration for the 19 required tables", "[/] Write and execute Supabase DDL migration for the 19 required tables (Script generated, awaiting user execution)")
content = content.replace("[ ] Implement Next.js Edge Middleware for Role Guards", "[x] Implement Next.js Edge Middleware for Role Guards")

with open("task.md", "w", encoding="utf-8") as f:
    f.write(content)
