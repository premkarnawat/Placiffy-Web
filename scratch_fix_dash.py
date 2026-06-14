with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Replace msgsRes with a query to notifications instead
old_msgs = "supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('read', false)"
new_msgs = "supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('is_read', false)"

content = content.replace(old_msgs, new_msgs)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Dashboard fixed")
