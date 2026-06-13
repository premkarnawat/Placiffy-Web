import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\support\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, AlertCircle, CheckCircle2, Clock, MessageSquare, ShieldAlert, Search, Loader2 } from 'lucide-react';

export default function SupportAdmin() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('support_tickets').select('*, users(email, role)').order('created_at', { ascending: false });
      if (error) throw error;
      setTickets(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from('support_tickets').update({ status: newStatus }).eq('id', id);
      await fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = tickets.filter(t => 
    t.status === activeTab && 
    ((t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) || (t.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return <AlertCircle size={16} className="text-amber-500" />;
      case 'pending': return <Clock size={16} className="text-blue-500" />;
      case 'closed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'escalated': return <ShieldAlert size={16} className="text-red-500" />;
      default: return <BookOpen size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Ticket Center</h1>
          <p className="text-slate-500 font-medium">Manage help desk tickets from Candidates and Companies.</p>
        </div>
        <button onClick={fetchTickets} className="bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-colors">
          Refresh Queue
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-max">
              {['open', 'pending', 'escalated', 'closed'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" placeholder="Search subject or email..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Subject</th>
                <th className="p-4">Submitter</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3"><BookOpen size={32}/></div>
                  <p className="text-slate-500 font-medium">No {activeTab} tickets found.</p>
                </td></tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.subject}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-md">{t.description}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-700">{t.users?.email}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">{t.users?.role || 'Unknown'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        t.priority === 'high' ? 'bg-red-50 text-red-700' : 
                        t.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>{t.priority || 'Normal'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(t.status)}
                        <span className="text-sm font-bold text-slate-700 capitalize">{t.status}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1">
                        <MessageSquare size={14}/> Reply
                      </button>
                      {t.status !== 'closed' && (
                        <button onClick={() => handleUpdateStatus(t.id, 'closed')} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                          Close
                        </button>
                      )}
                      {t.status === 'closed' && (
                        <button onClick={() => handleUpdateStatus(t.id, 'open')} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                          Reopen
                        </button>
                      )}
                      {t.status === 'open' && (
                        <button onClick={() => handleUpdateStatus(t.id, 'escalated')} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                          Escalate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}"""

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
