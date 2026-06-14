content = """'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Loader2, Briefcase, Building2, Calendar, ChevronRight, Award, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CandidateApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
      
      const channel = supabase.channel(`apps_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
           fetchApplications(false); // background fetch
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchApplications = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const { data: cand } = await supabase.from('candidates').select('id').eq('user_id', user?.id).single();
      if (!cand) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id, status, ats_score, applied_at,
          job:jobs ( job_title, location, employment_type, company:companies ( name, logo_url ) )
        `)
        .eq('candidate_id', cand.id)
        .in('status', ['applied', 'shortlisted', 'interviewing', 'offered', 'rejected', 'joined'])
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (e) {
      console.error("Failed to fetch applications", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'applied': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'interviewing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'offered': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'joined': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'applied': return <Clock size={16} />;
      case 'shortlisted': return <Award size={16} />;
      case 'interviewing': return <Briefcase size={16} />;
      case 'offered': return <CheckCircle2 size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'joined': return <CheckCircle2 size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 mt-1">Track the status of your submitted applications and ATS scores in real-time.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-blue-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No active applications</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't applied to any jobs yet. Complete your profile and start exploring opportunities to get noticed by top companies.</p>
          <Link href="/candidate/jobs" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {app.job?.company?.logo_url ? <img src={app.job.company.logo_url} alt="Logo" className="w-full h-full object-cover"/> : <Building2 className="text-gray-400" size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{app.job?.job_title || 'Unknown Role'}</h3>
                    <p className="text-sm text-gray-500 font-medium">{app.job?.company?.name || 'Unknown Company'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase size={14}/> {app.job?.employment_type || 'Full-time'}</span>
                      <span className="flex items-center gap-1"><Calendar size={14}/> Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start sm:items-end gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getStatusStyle(app.status)}`}>
                    {getStatusIcon(app.status)} {app.status}
                  </div>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">ATS MATCH</span>
                    <span className="text-sm font-black text-slate-800">{app.ats_score ? Math.round(app.ats_score * 100) : 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"""
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\applications\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated candidate applications logic")
