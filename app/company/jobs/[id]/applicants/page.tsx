'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Users, ArrowLeft, Mail, ExternalLink, Zap } from 'lucide-react';

export default function JobApplicantsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (user && jobId) fetchApplicants();
  }, [user, jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const { data: jobData } = await supabase.from('jobs').select('*').eq('job_id', jobId).single();
      setJob(jobData);

      const { data: appsData } = await supabase
        .from('applications')
        .select(`
          id, status, applied_at,
          candidates (
            id, full_name, headline, resume_url, trust_score, profile_completion_pct
          )
        `)
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      setApplicants(appsData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline mr-2 text-blue-500" /> Loading Applicants...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Applicants for {job?.job_title}</h1>
          <p className="text-slate-500 mt-1">Review and manage candidates who have applied to this position.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Candidate</th>
              <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Applied On</th>
              <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Trust Score</th>
              <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Status</th>
              <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applicants.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No applicants yet.</td></tr>
            ) : applicants.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{app.candidates?.full_name || 'Unknown Candidate'}</div>
                  <div className="text-xs text-slate-500">{app.candidates?.headline}</div>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {new Date(app.applied_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1 w-fit">
                    <Zap size={12}/> {app.candidates?.trust_score || 0}/1000
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">
                    {app.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {app.candidates?.resume_url && (
                      <a href={app.candidates.resume_url} target="_blank" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600">
                        <ExternalLink size={16}/>
                      </a>
                    )}
                    <button onClick={() => router.push('/company/messages')} className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-600">
                      <Mail size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
