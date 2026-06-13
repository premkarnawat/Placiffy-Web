import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\messages\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Search, Loader2, Send, Paperclip, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function MessagesAdmin() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv);
      
      const channel = supabase.channel(`admin_chat_${activeConv}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConv}` }, (payload) => {
          fetchMessages(activeConv); // Refresh to get relations
        })
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [activeConv]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Removed the direct join to users if it was failing. Instead we will fetch participants and then their emails separately to guarantee it works.
      const { data: convs, error } = await supabase.from('conversations').select('*, conversation_participants(user_id, role)').order('created_at', { ascending: false });
      if (error) throw error;
      
      const enriched = await Promise.all((convs || []).map(async (c) => {
        // manually fetch user details for each participant to guarantee it doesn't fail silently via bad FK
        const parts = await Promise.all((c.conversation_participants || []).map(async (p: any) => {
           const { data: u } = await supabase.from('users').select('email, name, role').eq('id', p.user_id).maybeSingle();
           return { ...p, users: u || { email: 'Unknown User' } };
        }));
        return { ...c, conversation_participants: parts };
      }));
      
      setConversations(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      setMsgLoading(true);
      const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
      if (error) throw error;
      
      // manually fetch user for messages too
      const enrichedMsgs = await Promise.all((data || []).map(async (m: any) => {
         const { data: u } = await supabase.from('users').select('email, role').eq('id', m.sender_id).maybeSingle();
         return { ...m, users: u };
      }));
      
      setMessages(enrichedMsgs);
    } catch (e) {
      console.error(e);
    } finally {
      setMsgLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || !user) return;
    
    try {
      await supabase.from('messages').insert({
        conversation_id: activeConv,
        sender_id: user.id,
        content: newMessage
      });
      setNewMessage('');
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = conversations.filter(c => {
    const participantEmails = c.conversation_participants?.map((p:any) => p.users?.email).join(' ') || '';
    return participantEmails.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Messaging Overseer</h1>
        <p className="text-slate-500 font-medium">Monitor and intervene in platform communications.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" placeholder="Search participants..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400"/></div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No conversations found.</div>
            ) : (
              filtered.map(c => {
                const participants = c.conversation_participants?.filter((p:any) => p.users?.role !== 'admin' && p.role !== 'admin') || [];
                const title = participants.map((p:any) => p.users?.email?.split('@')[0] || p.users?.name).join(' & ') || 'Internal Thread';
                const isActive = activeConv === c.id;
                
                return (
                  <button 
                    key={c.id} 
                    onClick={() => setActiveConv(c.id)}
                    className={`w-full text-left p-4 border-b border-gray-50 transition-colors ${isActive ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-slate-100/50 border-l-4 border-l-transparent'}`}
                  >
                    <p className={`font-bold text-sm ${isActive ? 'text-blue-900' : 'text-slate-800'} truncate`}>{title}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">Type: <span className="uppercase">{c.type}</span> | ID: {c.id.split('-')[0]}</p>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-white shadow-sm z-10 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><MessageSquare size={18} className="text-blue-500"/> Thread Supervision</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1"><AlertCircle size={14}/> Admin Intervening</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 flex flex-col">
                {msgLoading ? (
                  <div className="flex justify-center"><Loader2 className="animate-spin text-slate-400"/></div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm">No messages yet.</p>
                ) : (
                  messages.map(m => {
                    const isAdmin = m.users?.role === 'admin' || m.sender_id === user?.id;
                    const isCandidate = m.users?.role === 'candidate';
                    
                    return (
                      <div key={m.id} className={`flex flex-col max-w-[80%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-blue-500' : isCandidate ? 'text-emerald-600' : 'text-purple-600'}`}>
                            {m.users?.role || 'Unknown'}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${isAdmin ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-slate-800 rounded-tl-sm'}`}>
                          {m.content}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                  <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-xl hover:bg-slate-200"><Paperclip size={20}/></button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Send message as Admin..." 
                    className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 rounded-xl transition-colors"><Send size={18}/></button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={48} className="mb-4 opacity-20"/>
              <p className="font-medium">Select a thread to supervise.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}"""

os.makedirs(os.path.dirname(filepath), exist_ok=True)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
