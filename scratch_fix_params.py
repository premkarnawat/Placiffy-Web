# -*- coding: utf-8 -*-
files = [
    r"app\candidate\messages\page.tsx",
    r"app\admin\messages\page.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Common replacements
    content = content.replace("const markAsRead = async (messageId) => {", "const markAsRead = async (messageId: string) => {")
    content = content.replace("const handleSend = async (e) => {", "const handleSend = async (e: any) => {")
    content = content.replace("const handleFileUpload = async (e) => {", "const handleFileUpload = async (e: any) => {")
    content = content.replace("(payload) => {", "(payload: any) => {")
    content = content.replace("messages.map((msg, i)", "messages.map((msg: any, i: number)")
    
    # Admin specific replacements
    content = content.replace("const fetchMessages = async (contactId) => {", "const fetchMessages = async (contactId: string) => {")
    content = content.replace("filteredContacts.map(contact =>", "filteredContacts.map((contact: any) =>")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixed typescript strict parameters!")
