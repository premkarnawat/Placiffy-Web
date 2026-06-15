path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\layout.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "{ name: 'Support', href: '/admin/support', icon: BookOpen },\n    { name: 'Analytics', href: '/admin/analytics', icon: PieChart },",
    "{ name: 'Support', href: '/admin/support', icon: BookOpen },\n    { name: 'Notifications', href: '/admin/notifications', icon: Bell },\n    { name: 'Analytics', href: '/admin/analytics', icon: PieChart },"
)

with open(path, "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated Sidebar successfully.")
