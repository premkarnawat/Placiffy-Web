# -*- coding: utf-8 -*-
files = [
    r"app\candidate\messages\page.tsx",
    r"app\admin\messages\page.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("const [messages, setMessages] = useState([]);", "const [messages, setMessages] = useState<any[]>([]);")
    content = content.replace("const [contacts, setContacts] = useState([]);", "const [contacts, setContacts] = useState<any[]>([]);")
    content = content.replace("const [activeContact, setActiveContact] = useState(null);", "const [activeContact, setActiveContact] = useState<any>(null);")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixed useState typescript errors!")
