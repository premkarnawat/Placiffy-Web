# -*- coding: utf-8 -*-
content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { LifeBuoy, Plus, MessageSquare, Clock, CheckCircle, HelpCircle, FileText, UploadCloud, ChevronRight, Search } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function SupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ category: 'Technical Issue', subject: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Technical Issue', 'Profile Issue', 'Verification Issue', 'ATS Issue', 'Interview Issue', 'Offer Issue', 'Billing Issue', 'General Inquiry'];

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      if (error) throw error;
      setTickets(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTicket.subject || !newTicket.description) {
      toast('error', 'Missing Fields', 'Please fill out all fields.');
      return;
    }
    try {
      const { data, error } = await supabase.from('support_tickets').insert({
        user_id: user?.id,
        category: newTicket.category,
        subject: newTicket.subject,
        status: 'open',
        priority: 'normal'
      }).select().single();
      
      if (error) throw error;

      await supabase.from('support_messages').insert({
        ticket_id: data.id,
        sender_id: user?.id,
        content: newTicket.description
      });

      toast('success', 'Ticket Created', 'Your support ticket has been submitted.');
      setIsCreating(false);
      setNewTicket({ category: 'Technical Issue', subject: '', description: '' });
      fetchTickets();
    } catch (e: any) {
      toast('error', 'Failed to create ticket', e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LifeBuoy className="text-blue-600" size={32} /> Support Center
          </h1>
          <p className="text-gray-500 mt-1">Get help with verification, ATS features, and platform issues.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2"
        >
          {isCreating ? 'Cancel' : <><Plus size={18} /> New Ticket</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tickets */}
        <div className="lg:col-span-2 space-y-6">
          {isCreating && (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-6 mb-6 animate-in fade-in slide-in-from-top-4">
              <h2 className="text-lg font-bold mb-4">Create New Support Ticket</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" placeholder="Brief summary of the issue..."
                    value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={4} placeholder="Please provide detailed information..."
                    value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm">
                    Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Your Tickets</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input type="text" placeholder="Search tickets..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-500" />
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare className="text-gray-400" size={24} />
                  </div>
                  <h3 className="font-medium text-gray-900">No support tickets</h3>
                  <p className="text-sm text-gray-500 mt-1">You haven't submitted any support requests yet.</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 rounded-full p-2 ${ticket.status === 'open' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                        {ticket.status === 'open' ? <Clock size={16} /> : <CheckCircle size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{ticket.category}</span>
                          <span className="text-xs text-gray-400">• {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                          {ticket.status === 'open' ? 'Awaiting Support Reply' : 'Resolved'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors mt-2" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: FAQ & Knowledge Base */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Placify AI Assistant</h3>
              <p className="text-blue-100 text-sm mb-4">Get instant answers to common questions about ATS matching and profile verification.</p>
              <button className="w-full bg-white text-blue-700 font-medium py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <MessageSquare size={18} /> Chat with AI
              </button>
            </div>
            <HelpCircle size={100} className="absolute -right-6 -bottom-6 text-white opacity-10" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText size={18} className="text-gray-400"/> Knowledge Base</h3>
            <div className="space-y-3">
              {['How ATS Vector Matching works', 'Improving your Trust Score', 'Verification Process Guide', 'Adding Dynamic Portfolios'].map((topic, i) => (
                <a key={i} href="#" className="block p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700 hover:text-blue-700">
                  {topic}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"app\candidate\support\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Support Ticket System into Support Page!")
