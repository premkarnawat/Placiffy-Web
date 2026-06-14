content = """'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, AlertCircle, CheckCircle2, Clock, MessageSquare, ShieldAlert, Search, Loader2, Filter, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportAdmin() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
    const channel = supabase.channel('admin_support_tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => fetchTickets())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('support_tickets').select('*, users(email, full_name, candidates(first_name, last_name))').order('updated_at', { ascending: false });
      if (error) throw error;
      setTickets(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'open' 
        ? ['Open', 'In Progress', 'Pending'].includes(t.status)
        : t.status?.toLowerCase() === activeTab;
    
    const matchesSearch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.users?.email?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'in progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'resolved': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'closed': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-slate-600 bg-slate-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="text-blue-600" /> Support Desk
          </h1>
          <p className="text-gray-500 mt-1">Manage and resolve candidate support tickets</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 border-r border-gray-100">
            <div className="text-2xl font-black text-emerald-600">{tickets.filter(t => t.status === 'Open').length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Open</div>
          </div>
          <div className="text-center px-4 border-r border-gray-100">
            <div className="text-2xl font-black text-blue-600">{tickets.filter(t => t.status === 'In Progress').length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">In Progress</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl font-black text-red-600">{tickets.filter(t => t.priority === 'Critical' && t.status !== 'Closed').length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Critical</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl">
            {['open', 'closed', 'all'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-blue-500"><Loader2 className="animate-spin" size={32}/></div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center p-12 text-gray-500 flex flex-col items-center">
              <CheckCircle2 size={48} className="text-gray-200 mb-4"/>
              <p>No tickets found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 font-medium">Ticket ID</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Status & Priority</th>
                  <th className="p-4 font-medium">Candidate</th>
                  <th className="p-4 font-medium">Last Updated</th>
                  <th className="p-4 pr-6 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTickets.map(ticket => {
                  const candidateName = ticket.users?.candidates?.[0]?.first_name 
                    ? `${ticket.users.candidates[0].first_name} ${ticket.users.candidates[0].last_name || ''}`
                    : ticket.users?.full_name || ticket.users?.email || 'Unknown';
                    
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/support/${ticket.id}`)}>
                      <td className="p-4 pl-6">
                        <span className="font-mono text-xs text-gray-500 font-bold">#{ticket.id.split('-')[0]}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{ticket.subject}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{ticket.category}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-gray-900">{candidateName}</div>
                        <div className="text-xs text-gray-500">{ticket.users?.email}</div>
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-500">
                        {new Date(ticket.updated_at || ticket.created_at).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex items-center">
                          Resolve <ChevronRight size={16}/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\support\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated admin/support/page.tsx")
