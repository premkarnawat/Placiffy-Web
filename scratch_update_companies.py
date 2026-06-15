path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "supabase.from('subscriptions').select('company_id, plan_id, status')",
    "supabase.from('subscriptions').select('company_id, plan_tier, status')"
)

content = content.replace(
    "plan: sub ? sub.plan_id : 'Free',",
    "plan: sub ? sub.plan_tier : 'Free',"
)

with open(path, "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated Companies successfully.")
