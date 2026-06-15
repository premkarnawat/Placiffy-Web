content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Search, Filter, ShieldCheck, MapPin, 
  Briefcase, Globe, Loader2, Clock, AlertCircle, Mail, CreditCard 
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function CompanyRegistry() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');

  useEffect(() => {
    fetchCompanies();

    const channel = supabase.channel('admin_companies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchCompanies())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchCompanies())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchCompanies())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data: compData, error } = await supabase.from('companies').select('*, users(email)').order('created_at', { ascending: false });
      if (error) throw error;
      if (!compData) return;
      
      const compIds = compData.map(c => c.id);
      
      const [jobDataRes, appDataRes, subDataRes] = await Promise.all([
        supabase.from('jobs').select('company_id, id, status').in('company_id', compIds),
        supabase.from('applications').select('job_id'), // To count apps received
        supabase.from('subscriptions').select('company_id, plan_id, status').in('company_id', compIds)
      ]);

      const jobData = jobDataRes.data || [];
      const appData = appDataRes.data || [];
      const subData = subDataRes.data || [];

      const enriched = compData.map(c => {
        const jobs = jobData.filter(j => j.company_id === c.id);
        const jobIds = jobs.map(j => j.id);
        const apps = appData.filter(a => jobIds.includes(a.job_id));
        const sub = subData.find(s => s.company_id === c.id);

        return {
          ...c,
          email: c.users?.email || 'No Email',
          activeJobs: jobs.filter(j => j.status === 'Open').length,
          totalJobs: jobs.length,
          appsReceived: apps.length,
          plan: sub ? sub.plan_id : 'Free',
          subStatus: sub ? sub.status : 'inactive'
        };
      });

      setCompanies(enriched);
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to fetch company data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (c.name || '').toLowerCase().includes(term) || (c.industry || '').toLowerCase().includes(term) || (c.hq_location || '').toLowerCase().includes(term);
    
    let matchVer = true;
    if (filterVerified === 'verified') matchVer = c.verification_badge === true;
    if (filterVerified === 'unverified') matchVer = c.verification_badge !== true;
    
    return matchSearch && matchVer;
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
            <Building2 className="text-indigo-600" /> Company Registry
          </h1>
          <p className="text-gray-500 mt-1">Manage, verify, and oversee all registered companies.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>
          <select 
            value={filterVerified} 
            onChange={e => setFilterVerified(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Company Details</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Plan & Usage</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Metrics</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(comp => (
                <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {comp.logo_url ? (
                        <img src={comp.logo_url} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100">
                          {comp.name?.[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{comp.name || 'Unnamed Company'}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 flex flex-col gap-0.5">
                          <span className="flex items-center gap-1"><Mail size={10}/> {comp.email}</span>
                          <span className="flex items-center gap-1"><MapPin size={10}/> {comp.hq_location || 'Unknown'} • {comp.industry || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] bg-indigo-50 px-2 py-1 rounded w-max mb-1 flex items-center gap-1">
                      <CreditCard size={10}/> {comp.plan}
                    </div>
                    <div className="text-[10px] font-medium text-gray-500">Status: {comp.subStatus}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider w-12">Jobs:</span>
                        <span className="font-bold text-gray-900">{comp.activeJobs} <span className="text-[10px] font-normal text-gray-500">Active</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider w-12">Apps:</span>
                        <span className="font-bold text-gray-900">{comp.appsReceived}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {comp.verification_badge ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <ShieldCheck size={12}/> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                        <Clock size={12}/> Unverified
                      </span>
                    )}
                    <div className="text-[10px] text-gray-400 mt-1">Since {new Date(comp.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/companies/${comp.id}`} className="text-indigo-600 font-bold hover:underline text-xs">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No companies found.
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

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Company Registry updated and mapped correctly to DB schema")
