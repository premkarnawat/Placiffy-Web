with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\applications\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_query = """          id, status, ats_score, applied_at,
          job:jobs ( title, location, type, company:companies ( name, logo_url ) )"""

new_query = """          id, status, ats_score, applied_at,
          job:jobs ( job_title, location, employment_type, company:companies ( name, logo_url ) )"""
          
content = content.replace(old_query, new_query)

# Fix map rendering references
content = content.replace("app.job?.title", "app.job?.job_title")
content = content.replace("app.job?.type", "app.job?.employment_type")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\applications\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated application fetch query to match jobs schema")
