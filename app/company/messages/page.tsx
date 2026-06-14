'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Send, Paperclip, Check, CheckCheck, Clock, 
  Loader2, MessageSquare, AlertCircle, MapPin
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CompanyMessages() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const candParam = searchParams.get('cand');
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(candParam);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      
      const channel = supabase.channel(`company_msgs_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => fetchConversations())
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${user.id}` }, () => fetchConversations())
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  useEffect(() => {
    if (user && activeCandidateId) {
      fetchMessages(activeCandidateId);
    } else {
      setMessages([]);
    }
  }, [user, activeCandidateId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Fetch all messages involving the company
      const { data: allMsgs, error } = await supabase.from('messages')
        .select(`
          *,
          sender:sender_id(id, email, full_name, candidates(first_name, last_name, profile_photo_url, headline)),
          receiver:receiver_id(id, email, full_name, candidates(first_name, last_name, profile_photo_url, headline))
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Group by candidate id
      const convoMap = new Map();
      
      allMsgs?.forEach(msg => {
        const isSender = msg.sender_id === user?.id;
        const candId = isSender ? msg.receiver_id : msg.sender_id;
        const candData = isSender ? msg.receiver : msg.sender;
        
        if (!convoMap.has(candId)) {
          const cinfo = candData?.candidates?.[0] || {};
          convoMap.set(candId, {
            candidate_id: candId,
            name: cinfo.first_name ? `${cinfo.first_name} ${cinfo.last_name || ''}` : candData?.full_name || candData?.email,
            photo: cinfo.profile_photo_url,
            headline: cinfo.headline,
            latestMessage: msg.content,
            timestamp: msg.created_at,
            unread: !isSender && !!!msg.read_at ? 1 : 0
          });
        } else {
          if (!isSender && !!!msg.read_at) {
            const current = convoMap.get(candId);
            convoMap.set(candId, { ...current, unread: current.unread + 1 });
          }
        }
      });
      
      // If candParam is present but not in history, fetch their profile manually
      if (candParam && !convoMap.has(candParam)) {
        const { data: pData } = await supabase.from('users').select('*, candidates(*)').eq('id', candParam).single();
        if (pData) {
          const cinfo = pData.candidates?.[0] || {};
          convoMap.set(candParam, {
            candidate_id: candParam,
            name: cinfo.first_name ? `${cinfo.first_name} ${cinfo.last_name || ''}` : pData.full_name || pData.email,
            photo: cinfo.profile_photo_url,
            headline: cinfo.headline,
            latestMessage: 'Start a conversation...',
            timestamp: new Date().toISOString(),
            unread: 0
          });
        }
      }

      setConversations(Array.from(convoMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (candidateId: string) => {
    try {
      const { data, error } = await supabase.from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${candidateId}),and(sender_id.eq.${candidateId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data || []);
      
      // Mark as read
      const unreadIds = data?.filter(m => m.receiver_id === user?.id && !m.read).map(m => m.id);
      if (unreadIds && unreadIds.length > 0) {
        await supabase.from('messages').update({ read: true }).in('id', unreadIds);
        fetchConversations(); // refresh unread counts
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeCandidateId) return;
    
    setSending(true);
    try {
      await supabase.from('messages').insert([{
        sender_id: user?.id,
        receiver_id: activeCandidateId,
        message: reply
      }]);
      
      await supabase.from('notifications').insert([{
        user_id: activeCandidateId,
        type: 'message',
        title: 'New Message',
        message: `You received a message from a company.`,
        link: `/candidate/messages`
      }]);
      
      setReply('');
      fetchMessages(activeCandidateId);
      fetchConversations();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const activeConvo = conversations.find(c => c.candidate_id === activeCandidateId);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 h-[calc(100vh-80px)] flex gap-6">
      
      {/* Sidebar List */}
      <div className="w-1/3 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-gray-100 bg-slate-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <MessageSquare size={20} className="text-blue-600"/> Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
            <input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {conversations.length === 0 ? (
            <div className="text-center p-8 text-gray-400 text-sm">No conversations found.</div>
          ) : (
            conversations.map(convo => (
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
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                      {convo.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`text-sm truncate ${activeCandidateId === convo.candidate_id ? 'font-bold text-blue-900' : 'font-bold text-gray-900'}`}>{convo.name}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0">{new Date(convo.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={`text-xs truncate ${convo.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{convo.latestMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {!activeCandidateId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
            <MessageSquare size={64} className="text-gray-200 mb-4"/>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Select a conversation</h2>
            <p className="max-w-xs text-sm">Choose a candidate from the left sidebar to start messaging.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                {activeConvo?.photo ? (
                  <img src={activeConvo.photo} className="w-10 h-10 rounded-full object-cover"/>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {activeConvo?.name?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{activeConvo?.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{activeConvo?.headline || 'Candidate'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 text-sm font-medium">No messages yet. Send the first message!</div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {isMe && (
                        <div className="mt-1 px-1 flex items-center gap-1">
                          {!!msg.read_at ? <CheckCheck size={12} className="text-blue-500"/> : <Check size={12} className="text-gray-300"/>}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 shrink-0 flex gap-3 items-end">
              <button type="button" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0">
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
                {sending ? <Loader2 size={20} className="animate-spin"/> : <Send size={20} className="ml-1"/>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
