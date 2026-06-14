with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

import re

# Rewrite fetchConversations
new_fetch_convos = """  const fetchConversations = async () => {
    try {
      const { data: myParts } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', user?.id);
      if (!myParts || myParts.length === 0) { setLoading(false); return; }
      
      const convIds = myParts.map(p => p.conversation_id);
      const { data: otherParts } = await supabase.from('conversation_participants').select('conversation_id, user_id').in('conversation_id', convIds).neq('user_id', user?.id);
      
      if (!otherParts || otherParts.length === 0) { setLoading(false); return; }
      const otherUserIds = otherParts.map(p => p.user_id);
      
      const { data: cands } = await supabase.from('candidates').select('id, user_id, full_name, first_name, last_name, profile_photo_url, headline').in('user_id', otherUserIds);
      
      const { data: lastMsgs } = await supabase.from('messages').select('conversation_id, content, created_at, read_at, sender_id').in('conversation_id', convIds).order('created_at', { ascending: false });

      const convosMap = new Map();
      otherParts.forEach(part => {
        const candInfo = cands?.find(c => c.user_id === part.user_id);
        const msgs = lastMsgs?.filter(m => m.conversation_id === part.conversation_id) || [];
        const lastMsg = msgs[0];
        const unreadCount = msgs.filter(m => !m.read_at && m.sender_id !== user?.id).length;
        
        if (candInfo) {
          convosMap.set(candInfo.id, {
            candidate_id: candInfo.id,
            user_id: candInfo.user_id,
            conversation_id: part.conversation_id,
            name: candInfo.full_name || `${candInfo.first_name} ${candInfo.last_name || ''}`,
            headline: candInfo.headline,
            photo: candInfo.profile_photo_url,
            lastMessage: lastMsg?.content || '',
            lastMessageTime: lastMsg?.created_at || new Date().toISOString(),
            unread: unreadCount
          });
        }
      });
      
      setConversations(Array.from(convosMap.values()).sort((a,b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()));
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", e.message);
    } finally {
      setLoading(false);
    }
  };"""

content = re.sub(r"  const fetchConversations = async \(\) => \{[\s\S]*?setLoading\(false\);\s*\}\s*\}[\s]*\};", new_fetch_convos, content)

# Rewrite fetchMessages
new_fetch_msgs = """  const fetchMessages = async (candidateId: string) => {
    try {
      const convo = conversations.find(c => c.candidate_id === candidateId);
      if (!convo) return;
      
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', convo.conversation_id).order('created_at', { ascending: true });
      setMessages(data || []);
      
      // Mark as read
      await supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('conversation_id', convo.conversation_id).is('read_at', null).neq('sender_id', user?.id);
    } catch (e) {
      console.error(e);
    }
  };"""

content = re.sub(r"  const fetchMessages = async \(candidateId: string\) => \{[\s\S]*?console\.error\(e\);\s*\}\s*\}[\s]*\};", new_fetch_msgs, content)

# Rewrite handleSendMessage
new_send = """  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachments.length) return;
    const convo = conversations.find(c => c.candidate_id === activeCandidateId);
    if (!convo) return;
    
    setSending(true);
    try {
      const payload = attachments.length > 0 ? { files: attachments } : null;
      await supabase.from('messages').insert({
        conversation_id: convo.conversation_id,
        sender_id: user?.id,
        content: newMessage,
        payload
      });
      setNewMessage('');
      setAttachments([]);
      fetchMessages(activeCandidateId);
      fetchConversations();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setSending(false);
    }
  };"""

content = re.sub(r"  const handleSendMessage = async \(\) => \{[\s\S]*?setSending\(false\);\s*\}\s*\}[\s]*\};", new_send, content)

# Fix map keys in JSX
content = content.replace("msg.message", "msg.content")
content = content.replace("msg.payload?.files", "msg.payload?.files")
content = content.replace("msg.read", "!!msg.read_at")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Messages fixed")
