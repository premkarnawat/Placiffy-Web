content = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  HelpCircle, Loader2, ArrowLeft, Send, Paperclip, 
  FileText, CheckCircle2, AlertCircle, Clock, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AdminTicketDetails({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTicketData();

    const channel = supabase.channel(`admin_ticket_${params.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_replies', filter: `ticket_id=eq.${params.id}` }, (payload) => {
        setReplies(prev => [...prev, payload.new]);
        scrollToBottom();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `id=eq.${params.id}` }, (payload) => {
        setTicket(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const { data: tData } = await supabase.from('support_tickets').select('*').eq('id', params.id).single();
      if (!tData) throw new Error("Ticket not found");
      setTicket(tData);

      const { data: rData } = await supabase.from('support_replies').select('*').eq('ticket_id', params.id).order('created_at', { ascending: true });
      setReplies(rData || []);

      const [candRes, compRes] = await Promise.all([
        supabase.from('candidates').select('first_name, last_name, profile_photo_url').eq('user_id', tData.user_id).single(),
        supabase.from('companies').select('name, logo_url').eq('user_id', tData.user_id).single()
      ]);

      if (candRes.data) {
        setCreator({ name: `${candRes.data.first_name} ${candRes.data.last_name}`, photo: candRes.data.profile_photo_url, type: 'Candidate' });
      } else if (compRes.data) {
        setCreator({ name: compRes.data.name, photo: compRes.data.logo_url, type: 'Company' });
      } else {
        setCreator({ name: 'Unknown User', photo: null, type: 'User' });
      }

      scrollToBottom();
    } catch (e: any) {
      toast("error", "Error", "Failed to fetch ticket data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e?: React.FormEvent) => {
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
        const filePath = `support_attachments/${params.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('messages').upload(filePath, file);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('messages').getPublicUrl(filePath);
        attachmentUrl = publicUrl;
        attachmentType = file.type.startsWith('image/') ? 'image' : 'document';
        attachmentName = file.name;
      }

      await supabase.from('support_replies').insert({
        ticket_id: params.id,
        sender_id: user?.id,
        message: newMessage.trim(),
        attachment_url: attachmentUrl,
        attachment_type: attachmentType,
        attachment_name: attachmentName
      });

      // Optionally update ticket status to "In Progress" if it was open
      if (ticket?.status === 'Open') {
        await supabase.from('support_tickets').update({ status: 'In Progress' }).eq('id', params.id);
      }

      setNewMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: any) {
      toast("error", "Error", "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await supabase.from('support_tickets').update({ status: newStatus }).eq('id', params.id);
      setTicket({ ...ticket, status: newStatus });
      toast("success", "Status Updated", `Ticket marked as ${newStatus}`);
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
          <Link href="/admin/support" className="text-gray-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20}/>
          </Link>
          <div>
            <h2 className="font-bold text-gray-900 line-clamp-1">{ticket?.subject || 'Support Ticket'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ticket?.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {ticket?.status}
              </span>
              <span className="text-xs text-gray-400 font-mono">ID: {params.id.split('-')[0]}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={ticket?.status || 'Open'}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-bold bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="Open">Set Open</option>
            <option value="In Progress">Set In Progress</option>
            <option value="Resolved">Set Resolved</option>
            <option value="Closed">Set Closed</option>
          </select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {/* Original Ticket Description */}
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center gap-2 mb-1">
            <img src={creator?.photo || '/placeholder.png'} className="w-5 h-5 rounded-full object-cover bg-gray-200"/>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{creator?.name} ({creator?.type})</span>
            <span className="text-[10px] text-gray-300">{new Date(ticket?.created_at).toLocaleString()}</span>
          </div>
          <div className="max-w-[80%] px-5 py-4 rounded-2xl rounded-tl-sm bg-white text-gray-900 border border-gray-200 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 pb-2 border-b border-gray-100">Original Request</div>
            <p className="text-sm whitespace-pre-wrap">{ticket?.description}</p>
          </div>
        </div>

        {/* Replies */}
        {replies.map(reply => {
          const isAdmin = reply.sender_id === user?.id;
          const align = isAdmin ? 'items-end' : 'items-start';
          const bubble = isAdmin ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-gray-900 border border-gray-200 shadow-sm rounded-tl-sm';

          return (
            <div key={reply.id} className={`flex flex-col ${align} w-full`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isAdmin ? 'Admin Support' : creator?.name}</span>
                <span className="text-[10px] text-gray-300">{new Date(reply.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${bubble}`}>
                {reply.message && <p className="text-sm whitespace-pre-wrap">{reply.message}</p>}
                
                {reply.attachment_url && (
                  <div className={`mt-2 ${reply.message ? 'pt-2 border-t border-black/10' : ''}`}>
                    {reply.attachment_type === 'image' ? (
                      <a href={reply.attachment_url} target="_blank" rel="noreferrer">
                        <img src={reply.attachment_url} className="max-w-xs rounded-xl border border-black/10 hover:opacity-90 transition-opacity"/>
                      </a>
                    ) : (
                      <a href={reply.attachment_url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm font-bold p-3 rounded-xl transition-colors ${isAdmin ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-50 hover:bg-slate-100'}`}>
                        <FileText size={16}/> {reply.attachment_name || 'Document'}
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
        <form onSubmit={handleSendReply} className="flex items-end gap-2 relative">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={ticket?.status === 'Resolved' || ticket?.status === 'Closed' ? "Ticket closed. Type to reopen..." : "Type your reply..."}
              className="w-full bg-transparent border-none focus:ring-0 resize-none p-3 max-h-32 text-sm"
              rows={1}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <div className="px-3 pb-2 flex items-center gap-2">
              <label className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Paperclip size={16}/>
                <input type="file" ref={fileInputRef} className="hidden" />
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Attach file</span>
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
os.makedirs(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\support\[id]", exist_ok=True)
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\support\[id]\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Admin Ticket Details Page Created")
