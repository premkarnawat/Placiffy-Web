content = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, Send, Paperclip, Check, CheckCheck, Clock, 
  Loader2, MessageSquare, AlertCircle, MapPin
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CompanyMessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const candParam = searchParams.get('cand');
  const { toast } = useToast();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(candParam);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (candParam && activeCandidateId !== candParam) {
      setActiveCandidateId(candParam);
    }
  }, [candParam]);

  useEffect(() => {
    if (user) {
      fetchConversations();

      const channel = supabase.channel(`company_msgs_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
          fetchConversations();
          if (activeCandidateId) fetchMessages(activeCandidateId);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  useEffect(() => {
    if (activeCandidateId) {
      fetchMessages(activeCandidateId);
      
      // Update URL without reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('cand', activeCandidateId);
      window.history.pushState({}, '', newUrl);
    }
  }, [activeCandidateId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
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
            latestMessage: lastMsg?.content || '',
            timestamp: lastMsg?.created_at || new Date().toISOString(),
            unread: unreadCount
          });
        }
      });
      
      setConversations(Array.from(convosMap.values()).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (candidateId: string) => {
    try {
      const convo = conversations.find(c => c.candidate_id === candidateId);
      // Wait, if conversations hasn't loaded fully yet, we need to fetch the conversation_id directly!
      let convId = convo?.conversation_id;
      
      if (!convId) {
        // Fallback fetch if deep linked
        const { data: cData } = await supabase.from('candidates').select('user_id').eq('id', candidateId).single();
        if (cData) {
          const { data: pData } = await supabase.from('conversation_participants').select('conversation_id').in('user_id', [user?.id, cData.user_id]);
          // Find matching conv
          const countMap = {};
          pData?.forEach(p => { countMap[p.conversation_id] = (countMap[p.conversation_id] || 0) + 1 });
          convId = Object.keys(countMap).find(k => countMap[k] > 1);
        }
      }

      if (!convId) return;

      const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
      setMessages(data || []);
      
      // Mark as read
      await supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('conversation_id', convId).is('read_at', null).neq('sender_id', user?.id);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reply.trim() || !activeCandidateId) return;
    
    setSending(true);
    try {
      const convo = conversations.find(c => c.candidate_id === activeCandidateId);
      let convId = convo?.conversation_id;
      
      if (!convId) {
        toast("error", "Error", "Conversation not established properly");
        return;
      }
      
      await supabase.from('messages').insert({
        conversation_id: convId,
        sender_id: user?.id,
        content: reply
      });
      
      setReply('');
      fetchMessages(activeCandidateId);
      fetchConversations();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setSending(false);
    }
  };

  const activeConvo = conversations.find(c => c.candidate_id === activeCandidateId);
  const filteredConvos = conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full flex overflow-hidden">
        
        {/* Sidebar */}
        <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${activeCandidateId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <MessageSquare className="text-blue-600" /> Messaging
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={18}/>
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {filteredConvos.length === 0 ? (
              <div className="text-center p-8">
                <MessageSquare className="mx-auto text-gray-300 mb-3" size={32}/>
                <p className="text-gray-500 text-sm">No conversations found.</p>
              </div>
            ) : (
              filteredConvos.map(convo => (
                <div 
                  key={convo.candidate_id}
                  onClick={() => setActiveCandidateId(convo.candidate_id)}
                  className={`flex gap-3 p-4 rounded-2xl cursor-pointer transition-all border border-transparent ${activeCandidateId === convo.candidate_id ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'}`}
                >
                  <div className="relative shrink-0">
                    {convo.photo ? (
                      <img src={convo.photo} className="w-12 h-12 rounded-full object-cover"/>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {convo.name[0]}
                      </div>
                    )}
                    {convo.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold text-sm truncate ${activeCandidateId === convo.candidate_id ? 'text-blue-900' : 'text-gray-900'}`}>{convo.name}</h3>
                      <span className="text-[10px] text-gray-400 font-bold shrink-0">{new Date(convo.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-xs truncate ${convo.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>{convo.latestMessage || 'New Conversation'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 ${!activeCandidateId ? 'hidden md:flex' : 'flex'}`}>
          {!activeCandidateId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="text-blue-500" size={40}/>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
              <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to view your messages and chat with candidates.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-20 border-b border-gray-100 bg-white px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveCandidateId(null)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-600">
                    <AlertCircle size={20}/>
                  </button>
                  {activeConvo?.photo ? (
                    <img src={activeConvo.photo} className="w-10 h-10 rounded-full object-cover"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {activeConvo?.name?.[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-gray-900">{activeConvo?.name}</h2>
                    <p className="text-xs text-gray-500">{activeConvo?.headline || 'Candidate'}</p>
                  </div>
                </div>
                <button onClick={() => router.push(`/company/candidates/${activeCandidateId}`)} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                  View Profile
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-10">
                    No messages yet. Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.sender_id === user?.id;
                    const showDate = i === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[i-1].created_at).toDateString();
                    
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-6">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                              {new Date(msg.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5 px-1">
                            <span className="text-[10px] font-bold text-gray-400">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && (
                              <span className={msg.read_at ? "text-blue-500" : "text-gray-300"}>
                                {msg.read_at ? <CheckCheck size={14}/> : <Check size={14}/>}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={sendMessage} className="flex gap-3 items-end">
                  <button type="button" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0">
                    <Paperclip size={20}/>
                  </button>
                  <textarea 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
                    rows={1}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                  <button 
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm shrink-0"
                  >
                    {sending ? <Loader2 size={20} className="animate-spin"/> : <Send size={20}/>}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\messages\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Messages REWRITTEN completely")
