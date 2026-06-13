import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\jobs\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Briefcase, MapPin, Loader2, Eye, Trash2, PowerOff, Archive } from 'lucide-react';
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
      const { data, error } = await supabase.from('jobs').select('*, companies(name, logo_url)').order('created_at', { ascending: false });
      if (error) throw error;
      
      const jobsWithCounts = await Promise.all((data || []).map(async (j) => {
        const { data: apps } = await supabase.from('applications').select('status, ats_score').eq('job_id', j.job_id);
        const appList = apps || [];
        return { 
          ...j, 
          total_apps: appList.length,
          shortlisted: appList.filter(a => a.status === 'shortlisted').length,
          interviewed: appList.filter(a => a.status === 'interviewing').length,
          offered: appList.filter(a => a.status === 'offered').length,
          joined: appList.filter(a => a.status === 'hired').length,
          rejected: appList.filter(a => a.status === 'rejected').length
        };
      }));
      
      setJobs(jobsWithCounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await supabase.from('jobs').update({ status: newStatus }).eq('job_id', id);
      fetchJobs();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to hard delete this job?")) return;
    try {
      await supabase.from('jobs').delete().eq('job_id', id);
      fetchJobs();
    } catch (e) { console.error(e); }
  };

  const filtered = jobs.filter(j => (j.job_title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (j.companies?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

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
          <button onClick={fetchJobs} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Pipeline Metrics</th>
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
                        <Link href={`/admin/jobs/${j.job_id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">{j.job_title}</Link>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                           <span className="flex items-center gap-1"><MapPin size={12}/> {j.location || j.city}</span>
                           <span className="flex items-center gap-1"><Briefcase size={12}/> {j.employment_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {j.companies?.logo_url ? <img src={j.companies.logo_url} alt="" className="w-6 h-6 rounded border border-gray-200" /> : <div className="w-6 h-6 rounded bg-slate-100 border border-gray-200"></div>}
                        <span className="text-sm font-bold text-slate-700">{j.companies?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-center">
                        <div>
                          <p className="text-sm font-black text-blue-600 leading-none">{j.total_apps}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Apps</p>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-sm font-black text-purple-600 leading-none">{j.shortlisted}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Short</p>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-sm font-black text-amber-600 leading-none">{j.interviewed}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Intv</p>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-sm font-black text-emerald-600 leading-none">{j.joined}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Hired</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${j.status === 'open' || j.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{j.status ? j.status.toUpperCase() : 'OPEN'}</span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1">
                      <Link href={`/admin/jobs/${j.job_id}`} className="inline-block text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="View"><Eye size={16}/></Link>
                      {j.status !== 'archived' && j.status !== 'closed' && (
                         <button onClick={() => handleStatusChange(j.job_id, 'archived')} className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-amber-50 transition-colors" title="Archive"><Archive size={16}/></button>
                      )}
                      {j.status === 'archived' && (
                         <button onClick={() => handleStatusChange(j.job_id, 'open')} className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Re-open"><PowerOff size={16}/></button>
                      )}
                      <button onClick={() => handleDelete(j.job_id)} className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={16}/></button>
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
