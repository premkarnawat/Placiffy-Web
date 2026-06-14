content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  CreditCard, Search, CheckCircle2, XCircle, 
  Loader2, Building2, TrendingUp, DollarSign 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminBilling() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();

    const channel = supabase.channel('admin_billing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, () => fetchSubscriptions())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data: subData, error } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!subData || subData.length === 0) { setLoading(false); return; }

      const compIds = subData.map(s => s.company_id);
      const { data: compData } = await supabase.from('companies').select('id, company_name, logo_url').in('id', compIds);
      
      const comps = compData || [];

      const enriched = subData.map(sub => {
        const comp = comps.find(c => c.id === sub.company_id);
        
        return {
          ...sub,
          company_name: comp?.company_name || 'Unknown Company',
          logo_url: comp?.logo_url
        };
      });

      setSubscriptions(enriched);
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subId: string, newStatus: string) => {
    try {
      await supabase.from('subscriptions').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', subId);
      toast("success", "Status Updated", `Subscription marked as ${newStatus}`);
      fetchSubscriptions();
    } catch (e) {
      toast("error", "Error", "Failed to update subscription");
    }
  };

  const filtered = subscriptions.filter(s => 
    s.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.plan_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = subscriptions.filter(s => s.status === 'active').length * 499; // Mock monthly revenue assuming standard plan

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
            <CreditCard className="text-indigo-600" /> Billing & Subscriptions
          </h1>
          <p className="text-gray-500 mt-1">Manage company plans and track platform revenue.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="Search by company or plan..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={28}/>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated MRR</div>
            <div className="text-3xl font-black text-gray-900">${totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp size={28}/>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Plans</div>
            <div className="text-3xl font-black text-gray-900">{subscriptions.filter(s => s.status === 'active').length}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle size={28}/>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Canceled / Past Due</div>
            <div className="text-3xl font-black text-gray-900">{subscriptions.filter(s => s.status === 'past_due' || s.status === 'canceled').length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Plan & Usage</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Period End</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {s.logo_url ? (
                        <img src={s.logo_url} className="w-8 h-8 rounded-md object-cover border border-gray-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 text-xs font-bold"><Building2 size={14}/></div>
                      )}
                      <span className="font-bold text-gray-900">{s.company_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] bg-indigo-50 px-2 py-1 rounded w-max mb-1">
                      {s.plan_id || 'Standard Plan'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Jobs: {s.jobs_used || 0} / {s.jobs_limit || '∞'} • Candidates: {s.candidate_unlocks_used || 0} / {s.candidate_unlocks_limit || '∞'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {s.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 size={12}/> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                        <XCircle size={12}/> {s.status || 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{new Date(s.current_period_end).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      value={s.status || 'active'}
                      onChange={(e) => handleStatusUpdate(s.id, e.target.value)}
                      className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="active">Set Active</option>
                      <option value="past_due">Set Past Due</option>
                      <option value="canceled">Set Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No subscriptions found.
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

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\billing\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Billing Center rebuilt")
