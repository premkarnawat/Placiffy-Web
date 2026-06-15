content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Briefcase, MapPin, Loader2, ArrowLeft, Building2, 
  Users, FileText, CheckCircle2, AlertCircle, Clock 
} from 'lucide-react';
import Link from 'next/link';

export default function JobDetailsAdmin({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const channel = supabase.channel('admin_job_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `job_id=eq.${params.id}` }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, appRes] = await Promise.all([
        supabase.from('jobs').select('*, companies(name, logo_url)').eq('id', params.id).single(),
        supabase.from('applications').select('*, candidates(first_name, last_name, profile_photo_url, trust_score), resume_intelligence_reports(ats_resume_score)').eq('job_id', params.id)
      ]);
      
      setJob(jobRes.data);
      setApps(appRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40}/></div>;
  if (!job) return <div className="p-12 text-center text-slate-500 font-medium">Job not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft size={16}/> Back to Jobs
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm font-medium">
              <span className="flex items-center gap-1"><Building2 size={14}/> {job.companies?.name || 'Unknown Company'}</span>
              <span className="flex items-center gap-1"><MapPin size={14}/> {job.location || job.work_type}</span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold uppercase">{job.employment_type}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${job.status === 'Open' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              {job.status}
            </div>
            <div className="text-xs text-gray-400 mt-2">Posted: {new Date(job.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="text-indigo-600"/> Pipeline Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Applicants</span>
                <span className="text-xl font-black text-gray-900">{apps.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Shortlisted</span>
                <span className="text-xl font-black text-indigo-600">{apps.filter(a => a.status === 'shortlisted').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Interviewing</span>
                <span className="text-xl font-black text-purple-600">{apps.filter(a => a.status === 'interviewing').length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><FileText className="text-emerald-600"/> Applicant Pipeline</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Scores</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {apps.map(app => {
                    const cand = app.candidates;
                    const ats = app.resume_intelligence_reports?.[0]?.ats_resume_score || app.resume_intelligence_reports?.ats_resume_score || 'N/A';
                    
                    return (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {cand?.profile_photo_url ? (
                              <img src={cand.profile_photo_url} className="w-10 h-10 rounded-full object-cover"/>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                {cand?.first_name?.[0]}{cand?.last_name?.[0]}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-gray-900">{cand?.first_name} {cand?.last_name}</div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">{app.candidate_id?.split('-')[0]}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">Trust</span>
                              <span className="font-bold text-amber-600">{cand?.trust_score || 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">ATS Fit</span>
                              <span className="font-bold text-blue-600">{ats}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {new Date(app.applied_at || app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {app.status || 'applied'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/candidates/${app.candidate_id}`} className="text-indigo-600 font-bold hover:underline text-xs">
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {apps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No applications received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\jobs\[id]\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Job Pipeline updated to display applicants correctly")
