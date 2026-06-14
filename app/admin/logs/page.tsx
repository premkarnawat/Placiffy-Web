'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  FileText, Search, Clock, ShieldCheck, 
  User as UserIcon, Loader2, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminAuditLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();

    const channel = supabase.channel('admin_audit_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, () => fetchLogs())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase.from('audit_logs')
        .select('*, users(email)')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setLogs(data || []);
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => {
    const term = searchTerm.toLowerCase();
    return l.action?.toLowerCase().includes(term) || l.target_entity?.toLowerCase().includes(term) || l.target_id?.toLowerCase().includes(term) || l.admin_id?.toLowerCase().includes(term);
  });

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
            <FileText className="text-indigo-600" /> System Audit Logs
          </h1>
          <p className="text-gray-500 mt-1">Immutable record of all critical administrative actions.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="Search action or entity..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Target Entity</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Admin ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14}/> {new Date(log.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {log.action.includes('Verified') || log.action.includes('Approve') ? <ShieldCheck size={16} className="text-emerald-500"/> : 
                       log.action.includes('Rejected') || log.action.includes('Invalidated') ? <AlertCircle size={16} className="text-red-500"/> :
                       <FileText size={16} className="text-blue-500"/>}
                      {log.action}
                    </div>
                    {log.details && <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{log.details}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-indigo-600 uppercase tracking-wider text-[10px] bg-indigo-50 px-2 py-1 rounded w-max mb-1">
                      {log.target_entity}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{log.target_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                        <UserIcon size={12}/>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{log.users?.email || 'Admin'}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{log.admin_id?.split('-')[0]}...</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No audit logs found.
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
