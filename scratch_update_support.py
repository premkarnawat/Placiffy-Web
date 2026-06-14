with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\support\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace("supabase.from('knowledge_base')", "supabase.from('knowledge_base_articles')")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\support\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated support page")
