"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send, Paperclip, Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CompanyMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (user) {
        fetchConversations();
        const urlParams = new URLSearchParams(window.location.search);
        const autoOpenUserId = urlParams.get('candidate');
        if (autoOpenUserId) {
            // Auto open logic
            autoLoadConversation(autoOpenUserId);
        }
    }
  }, [user]);

  const autoLoadConversation = async (candidateUserId: string) => {
      try {
          const { data } = await supabase.from('candidates').select('id, user_id, full_name, headline').eq('user_id', candidateUserId).single();
          if (data) {
              loadMessages(data);
          }
      } catch(e) {
          console.error(e);
      }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would query the messages table grouped by user.
      // For this implementation, we will fetch candidates the company has interacted with.
      const { data: cu } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!cu) return;
      
      const { data: shorts } = await supabase.from('candidate_shortlists').select('candidate_id, status').eq('company_id', cu.id);
      if (shorts) {
          const cIds = shorts.map((s: any) => s.candidate_id);
          const { data: cands } = await supabase.from('candidates').select('id, user_id, full_name, headline').in('id', cIds);
          setConversations(cands || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (contact: any) => {
      setActiveChat(contact);
      try {
          const { data } = await supabase.from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${contact.user_id}),and(sender_id.eq.${contact.user_id},receiver_id.eq.${user?.id})`)
            .order('created_at', { ascending: true });
          
          setMessages(data || []);
          
          // Subscribe to real-time messages
          const channel = supabase.channel(`chat_${contact.user_id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user?.id}` }, (payload: any) => {
                setMessages((prev: any) => [...prev, payload.new]);
            }).subscribe();
            
      } catch (e) {
          console.error(e);
      }
  };

  const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || !activeChat) return;
      
      const msg = inputText.trim();
      setInputText("");
      
      // Optimistic update
      const tempMsg = { id: Date.now(), sender_id: user?.id, content: msg, created_at: new Date().toISOString() };
      setMessages((prev: any) => [...prev, tempMsg]);
      
      try {
          await supabase.from('messages').insert({
              sender_id: user?.id,
              receiver_id: activeChat.user_id,
              content: msg
          });
      } catch (err: any) {
          toast("error", "Failed to send", err.message);
      }
  };

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-2rem)] p-4 sm:p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
              <div className="p-4 border-b border-gray-100 bg-white">
                  <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input type="text" placeholder="Search conversations..." className="w-full bg-gray-100 border-0 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                  {loading ? (
                      <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600"/></div>
                  ) : conversations.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">No active conversations. Shortlist a candidate to begin chatting.</div>
                  ) : (
                      conversations.map((c: any) => (
                          <div key={c.id} onClick={() => loadMessages(c)} className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeChat?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-white'}`}>
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                                      {(c.full_name || c.headline).charAt(0).toUpperCase()}
                                  </div>
                                  <div className="overflow-hidden">
                                      <h3 className="font-bold text-gray-900 text-sm truncate">{c.full_name || c.headline}</h3>
                                      <p className="text-xs text-gray-500 truncate">Tap to view conversation</p>
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
          
          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white relative">
              {!activeChat ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                      <MessageSquare className="w-16 h-16 mb-4 text-gray-200"/>
                      <p className="font-bold text-gray-900 text-lg">Your Messages</p>
                      <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>
                  </div>
              ) : (
                  <>
                      {/* Chat Header */}
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                                  {(activeChat.full_name || activeChat.headline).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                  <h2 className="font-bold text-gray-900">{activeChat.full_name || activeChat.headline}</h2>
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Online
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                          {messages.length === 0 ? (
                              <div className="text-center py-10 text-gray-500 text-sm">This is the beginning of your conversation with {activeChat.headline}.</div>
                          ) : (
                              messages.map((m: any) => {
                                  const isMe = m.sender_id === user?.id;
                                  return (
                                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm flex flex-col gap-2 ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-900 shadow-sm rounded-tl-sm'}`}>
                                              {m.attachment_url && (
                                                  <a href={m.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors max-w-full overflow-hidden">
                                                      <Paperclip size={16} className="shrink-0"/>
                                                      <span className="truncate text-xs font-bold font-mono">View Attachment</span>
                                                  </a>
                                              )}
                                              <span>{m.content}</span>
                                          </div>
                                      </div>
                                  )
                              })
                          )}
                      </div>
                      
                      {/* Input Area */}
                      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                          <label className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer relative">
                              {uploadingFile ? <Loader2 className="animate-spin" size={20}/> : <Paperclip size={20}/>}
                              <input type="file" className="hidden" disabled={uploadingFile} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                          </label>
                          <input type="text" value={inputText} onChange={(e: any) => setInputText(e.target.value)} placeholder="Type your message..." className="flex-1 bg-gray-100 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500" />
                          <button type="submit" disabled={!inputText.trim()} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                              <Send size={20}/>
                          </button>
                      </form>
                  </>
              )}
          </div>
      </div>
    </div>
  );
}
