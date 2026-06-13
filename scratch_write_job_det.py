import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\jobs\[id]\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Briefcase, MapPin, Loader2, ArrowLeft, Building2, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailsAdmin({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, appRes] = await Promise.all([
        supabase.from('jobs').select('*, companies(*)').eq('job_id', params.id).single(),
        supabase.from('applications').select('*, candidates(full_name, location, trust_score, profile_photo_url)').eq('job_id', params.id).order('ats_score', { ascending: false })
      ]);
      setJob(jobRes.data);
      setApps(appRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>;
  if (!job) return <div className="p-12 text-center text-slate-500 font-medium">Job not found.</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={16}/> Back to Jobs Pipeline
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{job.job_title}</h1>
          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-2 text-slate-700 font-medium">
               {job.companies?.logo_url ? <img src={job.companies.logo_url} className="w-5 h-5 rounded" alt=""/> : <Building2 size={16}/>}
               {job.companies?.name}
             </div>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span className="flex items-center gap-1 text-slate-500"><MapPin size={16}/> {job.location || job.city}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span className="flex items-center gap-1 text-slate-500"><Briefcase size={16}/> {job.employment_type}</span>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${job.status === 'open' || job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
          {job.status ? job.status.toUpperCase() : 'OPEN'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Job Description</h3>
             <div className="text-slate-600 text-sm whitespace-pre-wrap">{job.job_description || 'No description provided.'}</div>
           </div>
           
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users size={18} className="text-purple-500"/> Candidate Pipeline ({apps.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-gray-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Candidate</th>
                      <th className="p-4 text-center">ATS Match</th>
                      <th className="p-4 text-center">Trust Score</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {apps.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500 text-sm">No applications yet.</td></tr>
                    ) : apps.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                           <Link href={`/admin/candidates/${a.candidate_id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors block">{a.candidates?.full_name}</Link>
                           <p className="text-xs text-slate-500">{a.candidates?.location}</p>
                        </td>
                        <td className="p-4 text-center">
                           <span className="font-black text-lg text-blue-600">{a.ats_score || 0}%</span>
                        </td>
                        <td className="p-4 text-center">
                           <span className="font-black text-sm text-emerald-600">{a.candidates?.trust_score || 0}</span>
                        </td>
                        <td className="p-4">
                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
        
        <div className="space-y-6">
           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-900 flex items-center gap-2"><Building2 size={18} className="text-emerald-500"/> Company Details</h3>
             {job.companies ? (
               <div>
                 <Link href={`/admin/companies/${job.companies.id}`} className="font-bold text-slate-900 hover:text-blue-600 block">{job.companies.name}</Link>
                 <p className="text-xs text-slate-500">{job.companies.industry} • {job.companies.size}</p>
                 <a href={job.companies.website} target="_blank" className="text-sm text-blue-600 hover:underline mt-2 block break-all">{job.companies.website}</a>
               </div>
             ) : <p className="text-sm text-slate-500">Unknown Company</p>}
           </div>
        </div>
      </div>
    </div>
  );
}"""

os.makedirs(os.path.dirname(filepath), exist_ok=True)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
