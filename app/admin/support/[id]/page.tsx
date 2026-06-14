'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Clock, Paperclip, Loader2, Download, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';

export default function AdminTicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ticketId) {
      fetchTicketData();

      const channel = supabase.channel(`admin_ticket_${ticketId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` }, () => fetchTicketData())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `id=eq.${ticketId}` }, () => fetchTicketData())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTicketData = async () => {
    try {
      const { data: tData, error: tErr } = await supabase.from('support_tickets').select('*, users(email, full_name, candidates(first_name, last_name))').eq('id', ticketId).single();
      if (tErr) throw tErr;
      setTicket(tData);

      const { data: mData, error: mErr } = await supabase.from('ticket_messages')
        .select(`*, ticket_attachments(*)`)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (mErr) throw mErr;
      setMessages(mData || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (status: string) => {
    try {
      await supabase.from('support_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', ticketId);
      
      // Notify candidate
      await supabase.from('notifications').insert([{
        user_id: ticket?.user_id,
        type: 'support',
        title: 'Support Ticket Updated',
        message: `Your ticket "${ticket?.subject}" has been marked as ${status}.`,
        link: `/candidate/support/${ticketId}`
      }]);
      
      toast({ title: "Success", description: `Ticket status changed to ${status}.` });
      fetchTicketData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(f => f.size <= 5 * 1024 * 1024);
      setAttachments([...attachments, ...validFiles]);
    }
  };

  const uploadAttachments = async (messageId: string) => {
    if (attachments.length === 0) return;
    
    for (const file of attachments) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${ticketId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('support-attachments').upload(filePath, file);
      if (uploadError) continue;
      
      const { data: publicUrlData } = supabase.storage.from('support-attachments').getPublicUrl(filePath);
      
      await supabase.from('ticket_attachments').insert([{
        ticket_id: ticketId,
        message_id: messageId,
        file_name: file.name,
        file_type: file.type,
        file_url: publicUrlData.publicUrl
      }]);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() && attachments.length === 0) return;
    
    setSending(true);
    setUploading(attachments.length > 0);
    try {
      const { data: msg, error } = await supabase.from('ticket_messages').insert([{
        ticket_id: ticketId,
        sender_id: user?.id,
        sender_role: 'admin',
        message: reply || 'Sent an attachment'
      }]).select().single();
      
      if (error) throw error;
      
      if (attachments.length > 0) {
        await uploadAttachments(msg.id);
      }
      
      await supabase.from('support_tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId);

      // Notify candidate
      await supabase.from('notifications').insert([{
        user_id: ticket?.user_id,
        type: 'support',
        title: 'Support Reply Received',
        message: `Placify Support replied to your ticket "${ticket?.subject}".`,
        link: `/candidate/support/${ticketId}`
      }]);

      setReply('');
      setAttachments([]);
      await fetchTicketData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'in progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'resolved': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'closed': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  };

  const candidateName = ticket?.users?.candidates?.[0]?.first_name 
    ? `${ticket.users.candidates[0].first_name} ${ticket.users.candidates[0].last_name || ''}`
    : ticket?.users?.full_name || ticket?.users?.email || 'Unknown User';

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[85vh]">
      
      {/* Chat Area */}
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin/support')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                Ticket #{ticket.id.split('-')[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">No messages found.</div>
          )}
          
          {messages.map((msg) => {
            const isAdmin = msg.sender_role === 'admin';
            return (
              <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{isAdmin ? 'You (Admin)' : candidateName}</span>
                  <span className="text-[10px] text-gray-400"><Clock size={10} className="inline mr-1"/>{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm text-sm ${isAdmin ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  
                  {msg.ticket_attachments && msg.ticket_attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.ticket_attachments.map((att: any) => (
                        <a 
                          key={att.id} 
                          href={att.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${isAdmin ? 'bg-indigo-700/50 border-indigo-500 hover:bg-indigo-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                          <Paperclip size={14} className={isAdmin ? 'text-indigo-300' : 'text-gray-400'}/>
                          <span className="text-xs font-medium truncate flex-1">{att.file_name}</span>
                          <Download size={14} className={isAdmin ? 'text-indigo-300' : 'text-gray-400'}/>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Area */}
        <form onSubmit={sendReply} className="bg-white p-4 border-t border-gray-100 shrink-0">
          {attachments.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 whitespace-nowrap">
                  <Paperclip size={14}/>
                  <span className="text-xs font-medium max-w-[150px] truncate">{file.name}</span>
                  <button type="button" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-indigo-400 hover:text-indigo-600">×</button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 shrink-0 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
            >
              <Paperclip size={20}/>
            </button>
            <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/>
            
            <textarea 
              value={reply} 
              onChange={e => setReply(e.target.value)}
              placeholder="Type your official admin response..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
              rows={2}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendReply(e);
                }
              }}
            />
            
            <button 
              type="submit" 
              disabled={sending || (!reply.trim() && attachments.length === 0)}
              className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {sending ? <Loader2 size={20} className="animate-spin"/> : <Send size={20} className="ml-1"/>}
            </button>
          </div>
        </form>
      </div>

      {/* Metadata Sidebar */}
      <div className="h-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Ticket Status</h2>
          <select 
            value={ticket.status} 
            onChange={(e) => updateTicketStatus(e.target.value)}
            className={`w-full font-bold px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${getStatusColor(ticket.status)}`}
          >
            <option value="Open" className="text-gray-900 bg-white">Open</option>
            <option value="In Progress" className="text-gray-900 bg-white">In Progress</option>
            <option value="Resolved" className="text-gray-900 bg-white">Resolved</option>
            <option value="Closed" className="text-gray-900 bg-white">Closed</option>
          </select>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Candidate Details</h2>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</div>
              <div className="text-sm font-bold text-gray-900">{candidateName}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</div>
              <div className="text-sm font-bold text-gray-900 break-all">{ticket.users?.email}</div>
            </div>
            <button onClick={() => router.push(`/admin/candidates/${ticket.user_id}`)} className="w-full mt-2 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 font-bold py-2 rounded-lg text-xs transition-colors">
              View Full Profile
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Ticket Metadata</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Category</span>
              <span className="font-bold text-gray-900">{ticket.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Priority</span>
              <span className="font-bold text-gray-900">{ticket.priority}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Created</span>
              <span className="font-bold text-gray-900">{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
