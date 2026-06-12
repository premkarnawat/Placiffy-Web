"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Briefcase, MapPin, Loader2, Calendar, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function JobsAdmin() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('jobs').select('*, companies!inner(name, logo_url)').order('created_at', { ascending: false });
      if (error) throw error;
      
      // Also get applications count per job (simulated simply here for UI, ideally an aggregate query)
      const jobsWithCounts = await Promise.all((data || []).map(async (j) => {
        const { count } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('job_id', j.job_id);
        return { ...j, application_count: count || 0 };
      }));
      
      setJobs(jobsWithCounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = jobs.filter(j => (j.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (j.companies?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Jobs Pipeline</h1>
          <p className="text-slate-500 font-medium">Audit platform job postings and application metrics.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by title or company..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Metrics</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No jobs found.</td></tr>
              ) : (
                filtered.map(j => (
                  <tr key={j.job_id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{j.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                           <span className="flex items-center gap-1"><MapPin size={12}/> {j.location}</span>
                           <span className="flex items-center gap-1"><Briefcase size={12}/> {j.employment_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {j.companies?.logo_url && <img alt="" src={j.companies.logo_url} className="w-6 h-6 rounded border border-gray-200" />}
                        <span className="text-sm font-bold text-slate-700">{j.companies?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-black text-blue-600 leading-none">{j.application_count}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Apps</p>
                        </div>
                        <div className="text-center opacity-50">
                          <p className="text-lg font-black text-slate-400 leading-none">0</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Shortlist</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${j.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{j.status ? j.status.toUpperCase() : 'OPEN'}</span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 inline-flex"><Eye size={14}/> View</button>
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
}
