import re

with open("C:\\Users\\premk\\.gemini\\antigravity\\scratch\\company_msg_fix.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add getOrCreateConversation and update loadMessages
new_load_messages = """
  const getOrCreateConversation = async (contactUserId: string) => {
      const { data: myParts } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', user?.id);
      const { data: theirParts } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', contactUserId);
      
      let convId = null;
      if (myParts && theirParts) {
          const myIds = myParts.map((p:any) => p.conversation_id);
          const theirIds = theirParts.map((p:any) => p.conversation_id);
          convId = myIds.find(id => theirIds.includes(id));
      }
      
      if (!convId) {
          const { data: newConv } = await supabase.from('conversations').insert({ type: 'company-candidate', status: 'active' }).select().single();
          if (newConv) {
              convId = newConv.id;
              await supabase.from('conversation_participants').insert([
                  { conversation_id: convId, user_id: user?.id, role: 'company' },
                  { conversation_id: convId, user_id: contactUserId, role: 'candidate' }
              ]);
          }
      }
      return convId;
  };

  const loadMessages = async (contact: any) => {
      setActiveChat(contact);
      try {
          const convId = await getOrCreateConversation(contact.user_id);
          if (!convId) return;
          
          contact.conversation_id = convId;
          setActiveChat({...contact, conversation_id: convId});
          
          const { data } = await supabase.from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });
          
          setMessages(data || []);
          
          const channel = supabase.channel(`chat_${convId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, (payload: any) => {
                setMessages((prev: any) => {
                    if (prev.find((m:any) => m.id === payload.new.id || (m.content === payload.new.content && m.sender_id === payload.new.sender_id && !m.id))) return prev;
                    return [...prev, payload.new];
                });
            }).subscribe();
            
      } catch (e) {
          console.error(e);
      }
  };
"""

content = re.sub(r"  const loadMessages = async \(contact: any\) => \{.*?\n  };\n", new_load_messages, content, flags=re.DOTALL)

# 2. Fix sendMessage
new_send_message = """
  const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || !activeChat || !activeChat.conversation_id) return;
      
      const msg = inputText.trim();
      setInputText("");
      
      const tempMsg = { id: Date.now(), sender_id: user?.id, content: msg, created_at: new Date().toISOString() };
      setMessages((prev: any) => [...prev, tempMsg]);
      
      try {
          await supabase.from('messages').insert({
              conversation_id: activeChat.conversation_id,
              sender_id: user?.id,
              content: msg
          });
      } catch (err: any) {
          toast("error", "Failed to send", err.message);
      }
  };
"""

content = re.sub(r"  const sendMessage = async \(e: React\.FormEvent\) => \{.*?\n  };\n", new_send_message, content, flags=re.DOTALL)

# 3. Fix handleFileUpload
new_handle_file = """
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !activeChat || !activeChat.conversation_id) return;
      
      setUploadingFile(true);
      try {
          const fileName = `attachment_${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage.from("message_attachments").upload(fileName, file);
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage.from("message_attachments").getPublicUrl(fileName);
          
          const msg = `Attached file: ${file.name}`;
          const tempMsg = { id: Date.now(), sender_id: user?.id, content: msg, attachment_url: data.publicUrl, created_at: new Date().toISOString() };
          setMessages((prev: any) => [...prev, tempMsg]);
          
          await supabase.from('messages').insert({
              conversation_id: activeChat.conversation_id,
              sender_id: user?.id,
              content: msg,
              attachment_url: data.publicUrl
          });
          
      } catch (err: any) {
          toast("error", "Upload Failed", err.message);
      } finally {
          setUploadingFile(false);
      }
  };
"""

content = re.sub(r"  const handleFileUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{.*?\n  };\n", new_handle_file, content, flags=re.DOTALL)

with open("C:\\Users\\premk\\.gemini\\antigravity\\scratch\\company_msg_fix.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Company messages fixed!")
