'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Clock, Paperclip } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function TicketDetailsPage() {
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && ticketId) {
      fetchTicketData();
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

      const { data: mData, error: mErr } = await supabase.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
      if (mErr) throw mErr;
      setMessages(mData || []);
    } catch (e: any) {
      toast('error', 'Error', 'Could not load ticket details.');
      router.push('/candidate/support');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || sending) return;
    setSending(true);

    try {
      const { data, error } = await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        sender_id: user?.id,
        content: reply.trim()
      }).select().single();
      
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setReply('');
      
      // Update ticket status to pending response if it was resolved/closed
      if (ticket?.status === 'resolved' || ticket?.status === 'closed') {
        await supabase.from('support_tickets').update({ status: 'open' }).eq('id', ticketId);
        setTicket({ ...ticket, status: 'open' });
      }

    } catch (e: any) {
      toast('error', 'Failed to send', e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!ticket) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      
      <button onClick={() => router.push('/candidate/support')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors mb-4">
        <ArrowLeft size={20} /> Back to Support
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Ticket Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket #{ticket.id.split('-')[0]}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <Clock size={16} /> Created {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-sm font-medium text-gray-600 block mb-1">Category</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 inline-block">
              {ticket.category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="p-6 sm:p-8 space-y-6 h-[400px] overflow-y-auto bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.sender_id === user?.id 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-gray-100 text-gray-900 rounded-tl-sm'
              }`}>
                <div className="flex justify-between items-start mb-1 gap-4">
                  <span className={`text-xs font-bold ${msg.sender_id === user?.id ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.sender_id === user?.id ? 'You' : 'Support Team'}
                  </span>
                  <span className={`text-[10px] ${msg.sender_id === user?.id ? 'text-blue-300' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Box */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
          {ticket.status === 'closed' ? (
            <div className="text-center p-4">
              <p className="text-gray-500 font-medium">This ticket is closed. Please create a new ticket if you need further assistance.</p>
            </div>
          ) : (
            <form onSubmit={handleReply} className="flex gap-2">
              <input 
                type="text" 
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..." 
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
              />
              <button 
                type="submit" 
                disabled={!reply.trim() || sending}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                {sending ? 'Sending...' : <><Send size={18} /> Send</>}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
