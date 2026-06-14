with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace('{ id: "analytics", label: "Analytics", icon: BarChart2, href: "/company/analytics" },', '')

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated company dashboard NAV")
