# -*- coding: utf-8 -*-
content = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Send, Paperclip, Image as ImageIcon, Loader2, FileText, Check, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CandidateMessages() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeChat, setActiveChat] = useState('admin'); // 'admin' or company_id
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
          markAsRead(payload.new.id);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data || []);
      
      // Mark unread as read
      const unreadIds = data?.filter(m => m.receiver_id === user.id && !m.read).map(m => m.id);
      if (unreadIds?.length > 0) {
        await supabase.from('messages').update({ read: true }).in('id', unreadIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId) => {
    await supabase.from('messages').update({ read: true }).eq('id', messageId);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !isUploading) return;
    
    setIsSending(true);
    try {
      // Find admin ID or use a generic one if not found (in real app, query for admin role)
      // For now, we'll just send to a placeholder admin ID or fetch the first admin
      const { data: adminData } = await supabase.from('users').select('id').eq('role', 'admin').limit(1).single();
      const receiverId = activeChat === 'admin' ? adminData?.id : activeChat;
      
      if (!receiverId) throw new Error("Could not find recipient");

      const msg = {
        sender_id: user.id,
        receiver_id: receiverId,
        content: newMessage.trim(),
        read: false
      };

      const { data, error } = await supabase.from('messages').insert(msg).select().single();
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      toast('error', 'Message Failed', 'Could not send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `chat_uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('message_attachments').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('message_attachments').getPublicUrl(filePath);

      // Send message with file
      const { data: adminData } = await supabase.from('users').select('id').eq('role', 'admin').limit(1).single();
      
      const msg = {
        sender_id: user.id,
        receiver_id: adminData?.id,
        content: `Sent a file: ${file.name}`,
        file_url: publicUrl,
        read: false
      };

      const { data, error } = await supabase.from('messages').insert(msg).select().single();
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      toast('success', 'File Sent', 'Your file was uploaded successfully.');
    } catch (error) {
      toast('error', 'Upload Failed', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="h-[calc(100vh-80px)] flex p-4 sm:p-8 gap-6">
      {/* Sidebar Channels */}
      <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <button 
            onClick={() => setActiveChat('admin')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeChat === 'admin' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">AD</span>
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900">Placify Support (Admin)</div>
              <div className="text-sm text-gray-500 truncate">How can we help you today?</div>
            </div>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="font-bold text-blue-600 text-sm">AD</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Placify Support (Admin)</h2>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div> Online
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Send className="text-gray-300" size={24} />
              </div>
              <p>No messages yet. Send a message to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                    {msg.file_url ? (
                      <div className="mb-2">
                        {msg.file_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <img src={msg.file_url} alt="Attachment" className="max-w-full rounded-lg max-h-48 object-cover" />
                        ) : (
                          <a href={msg.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-black/10 rounded-lg hover:bg-black/20 transition-colors">
                            <FileText size={20} />
                            <span className="text-sm font-medium">View Attachment</span>
                          </a>
                        )}
                      </div>
                    ) : null}
                    
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    <div className={`text-[10px] flex items-center gap-1 justify-end mt-1 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMine && (msg.read ? <CheckCheck size={14} className="text-blue-200" /> : <Check size={14} className="text-blue-200/50" />)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <div className="flex-1 relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all flex items-center">
              <label className="p-3 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors border-r border-gray-200">
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
              </label>
              
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 max-h-32 min-h-[50px] p-3 bg-transparent outline-none resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSending || (!newMessage.trim() && !isUploading)}
              className="h-[50px] w-[50px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
            >
              {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"app\candidate\messages\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
