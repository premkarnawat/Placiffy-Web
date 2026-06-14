content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Search, Filter, ShieldCheck, MapPin, 
  Briefcase, Globe, Loader2, Clock, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyRegistry() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');

  useEffect(() => {
    fetchCompanies();

    const channel = supabase.channel('admin_companies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchCompanies())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchCompanies())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data: compData, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const compIds = compData?.map(c => c.id) || [];
      const { data: jobData } = await supabase.from('jobs').select('company_id, id, status').in('company_id', compIds);
      
      const enriched = compData?.map(c => {
        const jobs = jobData?.filter(j => j.company_id === c.id) || [];
        return {
          ...c,
          activeJobs: jobs.filter(j => j.status === 'Open').length,
          totalJobs: jobs.length
        };
      }) || [];

      setCompanies(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c => {
    const matchSearch = `${c.company_name} ${c.industry} ${c.location}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVer = filterVerified === 'all' ? true : c.verification_status.toLowerCase() === filterVerified;
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
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Industry & Location</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Jobs</th>
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
                          {comp.company_name?.[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{comp.company_name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Globe size={10}/> {comp.website || 'No website'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{comp.industry || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {comp.location || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{comp.activeJobs} <span className="text-xs font-normal text-gray-500">Active</span></span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-xs">{comp.totalJobs} Total</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {comp.verification_status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <ShieldCheck size={12}/> Verified
                      </span>
                    ) : comp.verification_status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                        <Clock size={12}/> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                        <AlertCircle size={12}/> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/companies/${comp.id}`} className="text-indigo-600 font-bold hover:underline text-xs">
                      View Company
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

print("Company Registry rebuilt")
