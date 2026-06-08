'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send, Paperclip, MoreVertical, Search, CheckCircle2,  } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CommunicationHub() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
      
      // Simple Realtime Subscription Setup for Supabase
      const channel = supabase.channel(`room_${activeConv.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConv.id}` }, payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Get all conversation_participants for this user
      const { data: parts } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', user?.id);
      if (parts && parts.length > 0) {
        const convIds = parts.map((p:any) => p.conversation_id);
        const { data: convs } = await supabase.from('conversations').select('*').in('id', convIds).order('updated_at', { ascending: false });
        
        // Mocking participant names for UI if not joined with auth.users
        const enriched = (convs || []).map(c => ({
          ...c, 
          display_name: c.type === 'company-candidate' ? 'Google HR Team' : (c.type === 'admin-candidate' ? 'Placify Admin' : 'Support Team'),
          initial: c.type === 'company-candidate' ? 'G' : 'P'
        }));
        
        setConversations(enriched);
        if (enriched.length > 0) setActiveConv(enriched[0]);
      } else {
        // Create a dummy welcome conversation for the demo
        const { data: newConv } = await supabase.from('conversations').insert({ type: 'admin-candidate', status: 'active' }).select().single();
        if (newConv) {
          await supabase.from('conversation_participants').insert({ conversation_id: newConv.id, user_id: user?.id, role: 'candidate' });
          await supabase.from('messages').insert({ conversation_id: newConv.id, sender_id: null, content: 'Welcome to Placify! We are excited to have you here. Please complete your profile to get started.' });
          fetchConversations();
        }
      }
    } catch (e) { console.error(e); }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
      setMessages(data || []);
    } catch (e) { console.error(e); }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    
    const content = newMessage.trim();
    setNewMessage('');
    
    try {
      await supabase.from('messages').insert({
        conversation_id: activeConv.id,
        sender_id: user?.id,
        content: content
      });
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeConv.id);
    } catch (err: any) {
      toast('error', 'Message Failed', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex h-full overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-50/30">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare size={20} className="text-blue-600"/> Messages</h2>
            <div className="mt-4 relative">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setActiveConv(conv)}
                className={`p-4 border-b border-gray-100 flex items-center gap-3 cursor-pointer transition-colors ${activeConv?.id === conv.id ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-200">
                  {conv.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{conv.display_name}</h3>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">Just now</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.type === 'company-candidate' ? 'Looking forward to your interview.' : 'System message'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white min-w-0">
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                  {activeConv.initial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeConv.display_name}</h3>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"><Search size={20}/></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"><MoreVertical size={20}/></button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
              {messages.map((msg, i) => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`text-[10px] mt-1.5 flex justify-end items-center gap-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {isMine && <CheckCircle2 size={12} className="text-blue-300" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <button type="button" className="p-2.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-full transition-colors shrink-0">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-full transition-colors shrink-0 shadow-sm"
                >
                  <Send size={18} className="translate-x-0.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p className="font-medium text-lg text-gray-500">No active conversation selected</p>
          </div>
        )}

      </div>
    </div>
  );
}
