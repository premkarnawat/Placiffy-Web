content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  HelpCircle, Search, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, User as UserIcon, Loader2, Eye 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function AdminSupportCenter() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTickets();

    const channel = supabase.channel('admin_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => fetchTickets())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchTickets = async () => {
    try {
      const { data: ticketData, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!ticketData || ticketData.length === 0) { setLoading(false); return; }

      const userIds = ticketData.map(t => t.user_id);
      
      const [candsRes, compsRes] = await Promise.all([
        supabase.from('candidates').select('user_id, first_name, last_name, profile_photo_url').in('user_id', userIds),
        supabase.from('companies').select('user_id, name, logo_url').in('user_id', userIds)
      ]);

      const cands = candsRes.data || [];
      const comps = compsRes.data || [];

      const enriched = ticketData.map(ticket => {
        const cand = cands.find(c => c.user_id === ticket.user_id);
        const comp = comps.find(c => c.user_id === ticket.user_id);
        
        let creatorName = 'Unknown User';
        let creatorType = 'User';
        let creatorPhoto = null;

        if (cand) {
          creatorName = `${cand.first_name} ${cand.last_name}`;
          creatorType = 'Candidate';
          creatorPhoto = cand.profile_photo_url;
        } else if (comp) {
          creatorName = comp.name;
          creatorType = 'Company';
          creatorPhoto = comp.logo_url;
        }

        return {
          ...ticket,
          creatorName,
          creatorType,
          creatorPhoto
        };
      });

      setTickets(enriched);
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to fetch support tickets");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tickets.filter(t => {
    const term = searchTerm.toLowerCase();
    const searchMatch = t.subject?.toLowerCase().includes(term) || t.id.toLowerCase().includes(term) || t.creatorName.toLowerCase().includes(term);
    const statusMatch = filterStatus === 'all' || t.status?.toLowerCase() === filterStatus;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Resolved':
      case 'Closed':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 size={12}/> {status}</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-200 flex items-center gap-1 w-max"><Clock size={12}/> {status}</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-200 flex items-center gap-1 w-max"><AlertCircle size={12}/> Open</span>;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="text-indigo-600" /> Support Center
          </h1>
          <p className="text-gray-500 mt-1">Manage and resolve user tickets across the platform.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search by ID, Subject, or User..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Subject & Category</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {t.creatorPhoto ? (
                        <img src={t.creatorPhoto} className={`w-8 h-8 object-cover ${t.creatorType === 'Candidate' ? 'rounded-full' : 'rounded-md'}`} />
                      ) : (
                        <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${t.creatorType === 'Candidate' ? 'rounded-full bg-indigo-50 text-indigo-600' : 'rounded-md bg-purple-50 text-purple-600'}`}>
                          <UserIcon size={14}/>
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{t.creatorName}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.creatorType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 line-clamp-1">{t.subject || 'No Subject'}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.category || 'General'} • {new Date(t.created_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(t.status || 'Open')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      t.priority === 'High' ? 'bg-red-50 border-red-100 text-red-700' :
                      t.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                      'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {t.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <Link 
                        href={`/admin/support/${t.id}`}
                        className="p-2 rounded-xl transition-colors text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1"
                      >
                        <Eye size={14}/> View Ticket
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No support tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\support\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Admin Support Page Updated")
