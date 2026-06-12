# -*- coding: utf-8 -*-
with open("C:\\Users\\premk\\.gemini\\antigravity\\scratch\\company_msg_fix.tsx", "r", encoding="utf-8") as f:
    template = f.read()

# Replace components
template = template.replace("CompanyMessages", "CandidateMessages")

# Replace fetching logic
candidate_fetch = """
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data: myParts } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', user?.id);
      if (!myParts || myParts.length === 0) {
          setConversations([]);
          return;
      }
      
      const convIds = myParts.map((p: any) => p.conversation_id);
      const { data: otherParts } = await supabase.from('conversation_participants').select('conversation_id, user_id').in('conversation_id', convIds).neq('user_id', user?.id);
      
      if (!otherParts || otherParts.length === 0) {
          setConversations([]);
          return;
      }
      
      const otherUserIds = otherParts.map((p: any) => p.user_id);
      const { data: companies } = await supabase.from('companies').select('id, user_id, name').in('user_id', otherUserIds);
      
      // Map back to a list of 'conversations' for the UI
      const convs = otherParts.map((p: any) => {
          const comp = (companies || []).find((c: any) => c.user_id === p.user_id);
          return {
              conversation_id: p.conversation_id,
              user_id: p.user_id,
              full_name: comp ? comp.name : 'Unknown Company',
              headline: 'Company Representative'
          };
      });
      
      setConversations(convs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (contact: any) => {
      setActiveChat(contact);
      try {
          const convId = contact.conversation_id;
          
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

import re
template = re.sub(r"  const getOrCreateConversation = async.*?  };\n\n  const fetchConversations = async \(\) => \{.*?\n  };\n", candidate_fetch, template, flags=re.DOTALL)
template = re.sub(r"  const fetchConversations = async \(\) => \{.*?\n  };\n\n  const loadMessages = async.*?  };\n", candidate_fetch, template, flags=re.DOTALL)

with open("C:\\Users\\premk\\.gemini\\antigravity\\scratch\\candidate_msg_fix.tsx", "w", encoding="utf-8") as f:
    f.write(template)

print("Candidate messages generated!")
