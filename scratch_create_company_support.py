import os
os.makedirs(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\support\[id]", exist_ok=True)

page_content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { LifeBuoy, Plus, MessageSquare, Clock, CheckCircle, HelpCircle, FileText, ChevronRight, Search, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function CompanySupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ category: 'Billing Issues', priority: 'Medium', subject: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ['Billing Issues', 'Account Issues', 'Job Posting Issues', 'Candidate Visibility Issues', 'Technical Issues', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    if (user) {
      fetchTickets();
      const channel = supabase.channel(`company_support_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` }, () => fetchTickets())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('support_tickets').select('*').eq('user_id', user?.id).order('updated_at', { ascending: false });
      if (error) throw error;
      setTickets(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;
    
    try {
      const { data, error } = await supabase.from('support_tickets').insert([{
        user_id: user?.id,
        subject: newTicket.subject,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'Open',
        updated_at: new Date().toISOString()
      }]).select().single();
      
      if (error) throw error;
      
      await supabase.from('ticket_messages').insert([{
        ticket_id: data.id,
        sender_id: user?.id,
        sender_role: 'company',
        message: newTicket.description
      }]);
      
      toast({ title: "Success", description: "Support ticket created successfully." });
      setIsCreating(false);
      setNewTicket({ category: 'Billing Issues', priority: 'Medium', subject: '', description: '' });
      router.push(`/company/support/${data.id}`);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LifeBuoy className="text-blue-600" /> Support Desk
          </h1>
          <p className="text-gray-500 mt-2">Get help with billing, job postings, and technical issues.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={20}/> Your Support Threads
          </h2>
          
          {isLoading ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No active issues</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">You don't have any open support tickets.</p>
              <button onClick={() => setIsCreating(true)} className="text-blue-600 font-bold hover:underline">Create a ticket</button>
            </div>
          ) : (
            tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => router.push(`/company/support/${ticket.id}`)}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className="ml-2 px-2.5 py-1 text-xs font-bold rounded-full text-slate-600 bg-slate-50">
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                    <Clock size={14}/> 
                    {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 mb-3">{ticket.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded font-medium">{ticket.category}</span>
                  <span className="flex items-center text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    View Thread <ChevronRight size={16}/>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="text-amber-500" size={20}/> Enterprise Guides</h3>
            <div className="space-y-3">
              <a href="#" className="block p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <h4 className="text-sm font-bold text-gray-900 mb-1">Billing & Invoices</h4>
                <p className="text-xs text-gray-500">How to download your monthly VAT invoices.</p>
              </a>
              <a href="#" className="block p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <h4 className="text-sm font-bold text-gray-900 mb-1">ATS Ranking Algorithm</h4>
                <p className="text-xs text-gray-500">Understand how candidates are scored against your job descriptions.</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">Create Support Ticket</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={createTicket} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                  <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <input required type="text" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500" placeholder="Briefly describe the issue"/>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea required rows={5} value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 resize-none" placeholder="Provide detailed information..."/>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"""

details_content = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Clock, Paperclip, Loader2, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CompanyTicketDetailsPage() {
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && ticketId) {
      fetchTicketData();
      const channel = supabase.channel(`company_ticket_${ticketId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` }, () => fetchTicketData())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `id=eq.${ticketId}` }, () => fetchTicketData())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user, ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTicketData = async () => {
    try {
      const { data: tData, error: tErr } = await supabase.from('support_tickets').select('*').eq('id', ticketId).single();
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
    try {
      const { data: msg, error } = await supabase.from('ticket_messages').insert([{
        ticket_id: ticketId,
        sender_id: user?.id,
        sender_role: 'company',
        message: reply || 'Sent an attachment'
      }]).select().single();
      
      if (error) throw error;
      
      if (attachments.length > 0) await uploadAttachments(msg.id);
      
      await supabase.from('support_tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId);

      setReply('');
      setAttachments([]);
      await fetchTicketData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col h-[85vh]">
      <div className="bg-white rounded-t-3xl p-6 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/company/support')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5"><span>{ticket.category}</span></p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar space-y-6">
        {messages.map((msg) => {
          const isCompany = msg.sender_role === 'company';
          return (
            <div key={msg.id} className={`flex flex-col ${isCompany ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{isCompany ? 'You' : 'Placify Admin'}</span>
                <span className="text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm text-sm ${isCompany ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                <p className="whitespace-pre-wrap">{msg.message}</p>
                {msg.ticket_attachments?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.ticket_attachments.map((att: any) => (
                      <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${isCompany ? 'bg-blue-700/50 border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                        <Paperclip size={14}/>
                        <span className="text-xs truncate flex-1">{att.file_name}</span>
                        <Download size={14}/>
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

      {ticket.status?.toLowerCase() === 'closed' ? (
        <div className="p-6 bg-white border-t border-gray-100 rounded-b-3xl text-center text-gray-500 flex justify-center gap-2">
          <AlertCircle size={18}/> This ticket has been closed.
        </div>
      ) : (
        <form onSubmit={sendReply} className="bg-white rounded-b-3xl p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-end gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 border border-transparent">
              <Paperclip size={20}/>
            </button>
            <input type="file" multiple ref={fileInputRef} onChange={e => setAttachments([...attachments, ...Array.from(e.target.files||[])])} className="hidden" accept=".pdf,.png,.jpg,.jpeg"/>
            
            <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 resize-none" rows={1} onKeyDown={e => {if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendReply(e);}}}/>
            
            <button type="submit" disabled={sending} className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50">
              {sending ? <Loader2 size={20} className="animate-spin"/> : <Send size={20}/>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\support\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(page_content)
    
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\support\[id]\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(details_content)

print("Created company support pages")
