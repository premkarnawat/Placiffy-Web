content = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  MessageSquare, Loader2, ArrowLeft, Building2, User as UserIcon,
  Send, Paperclip, FileText, FileImage, ShieldAlert, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AdminConversationDetails({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [participants, setParticipants] = useState<any>({ candidate: null, company: null });
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversationData();

    const channel = supabase.channel(`admin_chat_${params.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${params.id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        scrollToBottom();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${params.id}` }, (payload) => {
        setConversation(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchConversationData = async () => {
    try {
      setLoading(true);
      const { data: conv } = await supabase.from('conversations').select('*').eq('id', params.id).single();
      setConversation(conv);

      const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', params.id).order('created_at', { ascending: true });
      setMessages(msgs || []);

      const { data: parts } = await supabase.from('conversation_participants').select('user_id').eq('conversation_id', params.id);
      if (parts) {
        const userIds = parts.map(p => p.user_id);
        const [cands, comps] = await Promise.all([
          supabase.from('candidates').select('user_id, first_name, last_name, profile_photo_url').in('user_id', userIds),
          supabase.from('companies').select('user_id, name, logo_url').in('user_id', userIds)
        ]);
        
        setParticipants({
          candidate: cands.data?.[0],
          company: comps.data?.[0]
        });
      }

      scrollToBottom();
    } catch (e: any) {
      toast("error", "Error", "Failed to fetch conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;
    
    try {
      setSending(true);
      let attachmentUrl = null;
      let attachmentType = null;
      let attachmentName = null;

      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `admin_attachments/${params.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('messages').upload(filePath, file);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('messages').getPublicUrl(filePath);
        attachmentUrl = publicUrl;
        attachmentType = file.type.startsWith('image/') ? 'image' : 'document';
        attachmentName = file.name;
      }

      await supabase.from('messages').insert({
        conversation_id: params.id,
        sender_id: user?.id, // Admin ID
        content: newMessage.trim(),
        attachment_url: attachmentUrl,
        attachment_type: attachmentType,
        attachment_name: attachmentName
      });

      setNewMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: any) {
      toast("error", "Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const toggleFlag = async () => {
    try {
      const newStatus = conversation?.status === 'flagged' ? 'active' : 'flagged';
      await supabase.from('conversations').update({ status: newStatus }).eq('id', params.id);
      setConversation({ ...conversation, status: newStatus });
      toast("success", "Success", `Conversation ${newStatus}`);
    } catch (e) {
      toast("error", "Error", "Failed to update status");
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40}/></div>;

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[85vh] bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/messages" className="text-gray-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20}/>
          </Link>
          <div className="flex items-center gap-6">
            {participants.candidate && (
              <div className="flex items-center gap-2">
                <img src={participants.candidate.profile_photo_url || '/placeholder.png'} className="w-8 h-8 rounded-full object-cover bg-indigo-50"/>
                <div className="font-bold text-gray-900 text-sm">{participants.candidate.first_name} {participants.candidate.last_name}</div>
              </div>
            )}
            <span className="text-gray-300">↔</span>
            {participants.company && (
              <div className="flex items-center gap-2">
                <img src={participants.company.logo_url || '/placeholder.png'} className="w-8 h-8 rounded-md object-cover bg-purple-50"/>
                <div className="font-bold text-gray-900 text-sm">{participants.company.name}</div>
              </div>
            )}
          </div>
        </div>
        <div>
          <button 
            onClick={toggleFlag}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${conversation?.status === 'flagged' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-slate-50'}`}
          >
            {conversation?.status === 'flagged' ? <><ShieldAlert size={14}/> Flagged</> : <><CheckCircle2 size={14}/> Active</>}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Conversation Started {new Date(conversation?.created_at).toLocaleDateString()}</div>
        
        {messages.map(msg => {
          const isAdmin = msg.sender_id === user?.id;
          const isCand = msg.sender_id === participants.candidate?.user_id;
          
          let senderName = isAdmin ? 'Admin' : (isCand ? participants.candidate?.first_name : participants.company?.name);
          let bubbleColor = isAdmin ? 'bg-indigo-600 text-white' : (isCand ? 'bg-blue-50 text-blue-900 border border-blue-100' : 'bg-white text-gray-900 border border-gray-200');
          let align = isAdmin ? 'items-end' : 'items-start';

          return (
            <div key={msg.id} className={`flex flex-col ${align} w-full`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{senderName}</span>
                <span className="text-[10px] text-gray-300">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${bubbleColor} ${isAdmin ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                
                {msg.attachment_url && (
                  <div className={`mt-2 ${msg.content ? 'pt-2 border-t border-black/10' : ''}`}>
                    {msg.attachment_type === 'image' ? (
                      <a href={msg.attachment_url} target="_blank" rel="noreferrer">
                        <img src={msg.attachment_url} className="max-w-xs rounded-xl border border-black/10 hover:opacity-90 transition-opacity"/>
                      </a>
                    ) : (
                      <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold bg-black/5 p-3 rounded-xl hover:bg-black/10 transition-colors">
                        <FileText size={16}/> {msg.attachment_name || 'Document'}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Send message as Admin..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none p-3 max-h-32 text-sm"
              rows={1}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="px-3 pb-2 flex items-center gap-2">
              <label className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Paperclip size={16}/>
                <input type="file" ref={fileInputRef} className="hidden" />
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Intervene in this conversation</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={sending || (!newMessage.trim() && !fileInputRef.current?.files?.length)}
            className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0 shadow-sm"
          >
            {sending ? <Loader2 size={20} className="animate-spin"/> : <Send size={20}/>}
          </button>
        </form>
      </div>

    </div>
  );
}
"""

import os
os.makedirs(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\messages\[id]", exist_ok=True)
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\messages\[id]\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Admin Conversation Detail Page Created")
