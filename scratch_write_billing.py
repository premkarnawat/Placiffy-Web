import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\billing\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Receipt, Search, CreditCard, DollarSign, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export default function BillingAdmin() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [revenue, setRevenue] = useState({ mrr: 0, arr: 0 });

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('subscriptions').select('*, companies(name, logo_url)').order('created_at', { ascending: false });
      if (error) throw error;
      
      const subs = data || [];
      setSubscriptions(subs);
      
      // Calculate mock MRR based on active plans
      let mrr = 0;
      subs.forEach(s => {
        if (s.status === 'active') {
          if (s.plan_tier === 'pro') mrr += 299;
          else if (s.plan_tier === 'enterprise') mrr += 999;
        }
      });
      setRevenue({ mrr, arr: mrr * 12 });
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = subscriptions.filter(s => (s.companies?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Subscriptions</h1>
          <p className="text-slate-500 font-medium">Monitor enterprise SaaS subscriptions and revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><DollarSign size={24}/></div>
          <div>
            <p className="text-sm font-bold text-slate-500">Monthly Recurring (MRR)</p>
            <p className="text-2xl font-black text-slate-900">${revenue.mrr.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><TrendingUp size={24}/></div>
          <div>
            <p className="text-sm font-bold text-slate-500">Annual Recurring (ARR)</p>
            <p className="text-2xl font-black text-slate-900">${revenue.arr.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-3xl p-6 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 text-amber-400 rounded-full flex items-center justify-center"><AlertCircle size={24}/></div>
          <div>
            <p className="text-sm font-bold text-slate-400">Pending Payments</p>
            <p className="text-2xl font-black text-white">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search companies..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Company</th>
                <th className="p-4">Plan Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4">Billing Period</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No subscriptions found.</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      {s.companies?.logo_url ? <img src={s.companies.logo_url} alt="" className="w-8 h-8 rounded border border-gray-200"/> : <div className="w-8 h-8 bg-slate-100 rounded border border-gray-200"></div>}
                      <span className="text-sm font-bold text-slate-900">{s.companies?.name}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        s.plan_tier === 'enterprise' ? 'bg-purple-50 text-purple-700' : 
                        s.plan_tier === 'pro' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>{s.plan_tier || 'Free'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 
                        s.status === 'trialing' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>{s.status || 'Active'}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-slate-700">{new Date(s.current_period_start).toLocaleDateString()} - {new Date(s.current_period_end).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Upgrade</button>
                      <button className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">History</button>
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
