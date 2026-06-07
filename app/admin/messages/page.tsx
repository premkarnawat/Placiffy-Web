'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Send, Paperclip, Loader2, FileText, Check, CheckCheck, Search, Users } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminMessages() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchContacts();
      
      const channel = supabase
        .channel('admin:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user?.id}` }, (payload: any) => {
          setMessages(prev => [...prev, payload.new]);
          if (activeContact && payload.new.sender_id === activeContact.id) {
            markAsRead(payload.new.id);
          } else {
            // Update contact list unread count (mock implementation)
            fetchContacts();
          }
        })
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact.id);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      // Get all users who are candidates or companies
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .neq('role', 'admin');
        
      if (error) throw error;
      setContacts(data || []);
      if (data?.length > 0 && !activeContact) setActiveContact(data[0]);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data || []);
      
      const unreadIds = data?.filter(m => m.receiver_id === user?.id && !m.read).map(m => m.id);
      if (unreadIds?.length > 0) {
        await supabase.from('messages').update({ read: true }).in('id', unreadIds);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', messageId);
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim() && !isUploading || !activeContact) return;
    
    setIsSending(true);
    try {
      const msg = {
        sender_id: user?.id,
        receiver_id: activeContact.id,
        content: newMessage.trim(),
        read: false
      };

      const { data, error } = await supabase.from('messages').insert(msg).select().single();
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error: any) {
      toast('error', 'Message Failed', 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !activeContact) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `chat_uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('message_attachments').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('message_attachments').getPublicUrl(filePath);

      const msg = {
        sender_id: user?.id,
        receiver_id: activeContact.id,
        content: `Sent a file: ${file.name}`,
        file_url: publicUrl,
        read: false
      };

      const { data, error } = await supabase.from('messages').insert(msg).select().single();
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
    } catch (error: any) {
      toast('error', 'Upload Failed', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredContacts = contacts.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (authLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="h-[calc(100vh-40px)] flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar Contacts */}
      <div className="w-80 flex flex-col border-r border-gray-100 bg-gray-50/30">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users size={18}/> Users Directory</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact: any) => (
            <button 
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`w-full flex items-center gap-3 p-4 transition-colors border-b border-gray-50 ${activeContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-sm">
                {contact.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="text-left flex-1 overflow-hidden">
                <div className="font-semibold text-gray-900 truncate">{contact.name || contact.email}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{contact.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeContact ? (
        <div className="flex-1 flex flex-col bg-[#f8fafc]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                {activeContact.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{activeContact.name}</h2>
                <div className="text-xs text-gray-500">{activeContact.email}</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>No messages with {activeContact.name} yet.</p>
              </div>
            ) : (
              messages.map((msg: any, i: number) => {
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

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <div className="flex-1 relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 flex items-center">
                <label className="p-3 text-gray-400 hover:text-blue-600 cursor-pointer border-r border-gray-200">
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message candidate..."
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
                className="h-[50px] w-[50px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-sm flex-shrink-0"
              >
                {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] text-gray-400">
          <Users size={48} className="mb-4 text-gray-300" />
          <p>Select a user to start messaging</p>
        </div>
      )}
    </div>
  );
}
