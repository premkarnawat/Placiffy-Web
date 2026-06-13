import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Building2, MapPin, Loader2, Eye, ShieldCheck, Mail, Globe, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function CompaniesAdmin() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Fetch companies with users for email/name
      const { data, error } = await supabase.from('companies').select('*, users(email, name, phone)').order('created_at', { ascending: false });
      if (error) throw error;
      
      const enriched = await Promise.all((data || []).map(async (c) => {
        const [jobsRes, appsRes, verRes, subRes] = await Promise.all([
           supabase.from('jobs').select('job_id').eq('company_id', c.id),
           supabase.from('applications').select('id, jobs!inner(company_id)').eq('jobs.company_id', c.id),
           supabase.from('verifications').select('status').eq('user_id', c.user_id).maybeSingle(),
           supabase.from('subscriptions').select('plan_tier, status').eq('company_id', c.id).maybeSingle()
        ]);
        return { 
          ...c, 
          total_jobs: jobsRes.data?.length || 0,
          total_apps: appsRes.data?.length || 0,
          verification_status: verRes.data?.status || 'unverified',
          subscription: subRes.data || { plan_tier: 'free', status: 'none' }
        };
      }));
      
      setCompanies(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Registry</h1>
          <p className="text-slate-500 font-medium">Manage corporate partners and employers.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by company name..." 
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
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Metrics</th>
                <th className="p-4">Status & Plan</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No companies found.</td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-start gap-3">
                         {c.logo_url ? <img src={c.logo_url} className="w-10 h-10 rounded-xl border border-gray-200" alt=""/> : <div className="w-10 h-10 bg-slate-100 rounded-xl border border-gray-200 flex items-center justify-center"><Building2 size={20} className="text-slate-400"/></div>}
                         <div>
                           <Link href={`/admin/companies/${c.id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors">{c.name}</Link>
                           <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {c.hq_location || 'Unknown'} • {c.industry}</p>
                           {c.website && <a href={c.website} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"><Globe size={12}/> Website</a>}
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-700">{c.users?.name || 'Admin User'}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Mail size={12}/> {c.users?.email}</p>
                      {c.users?.phone && <p className="text-xs text-slate-500 mt-0.5">{c.users.phone}</p>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-4 text-center">
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none">{c.total_jobs}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Jobs</p>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-sm font-black text-blue-600 leading-none">{c.total_apps}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Apps</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          {c.verification_status === 'approved' ? <ShieldCheck size={14} className="text-emerald-500"/> : <ShieldCheck size={14} className="text-slate-300"/>}
                          <span className={`text-xs font-bold uppercase tracking-wider ${c.verification_status === 'approved' ? 'text-emerald-600' : 'text-slate-500'}`}>{c.verification_status}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard size={14} className={c.subscription.plan_tier !== 'free' ? 'text-purple-500' : 'text-slate-400'}/>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{c.subscription.plan_tier}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                          <Calendar size={12}/> {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/admin/companies/${c.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        View Enterprise <Eye size={14}/>
                      </Link>
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

os.makedirs(os.path.dirname(filepath), exist_ok=True)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
